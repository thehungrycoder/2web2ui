import requestHelperFactory from './requestHelperFactory';
import _ from 'lodash';
import { zuora as zuoraAxios } from './axiosInstances';

export default requestHelperFactory({
  request: zuoraAxios,
  onSuccess: ({ types, response, dispatch, meta }) => {
    if (!response.success) {
      const message = _.get(response, 'reasons[0].message', 'An error occurred while contacting the billing service');

      dispatch({
        type: types.FAIL,
        payload: { message, response },
        meta
      });

      const err = new Error(message);
      err.response = response;
      throw err;
    }

    dispatch({
      type: types.SUCCESS,
      payload: response,
      meta
    });

    return response;
  }
});
