import config from 'config/index';
import requestHelperFactory from './requestHelperFactory';
import axios from 'axios';
import _ from 'lodash';
import { zuoraAxios } from './axiosInstances';

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
      err.handled = true;
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
