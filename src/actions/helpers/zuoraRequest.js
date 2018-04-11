import requestHelperFactory from './requestHelperFactory';
import _ from 'lodash';
import { zuora as zuoraAxios } from 'src/helpers/axiosInstances';
import { showAlert } from 'src/actions/globalAlert';
import { stripTags } from 'src/helpers/string';

export default requestHelperFactory({
  request: zuoraAxios,
  onSuccess: ({ types, response, dispatch, meta }) => {
    if (!response.data.success) {
      const message = _.get(response, 'data.reasons[0].message', 'An error occurred while contacting the billing service');
      const sanitizedMessage = stripTags(message); // some messages include html tags

      dispatch({
        type: types.FAIL,
        payload: { message: sanitizedMessage, response },
        meta
      });

      const err = new Error(sanitizedMessage);
      err.name = 'ZuoraApiError';
      err.response = response;

      // auto alert all errors
      dispatch(showAlert({ type: 'error', message: sanitizedMessage }));

      // TODO: 'return' err once we unchain all actions
      throw err;
    }

    dispatch({
      type: types.SUCCESS,
      payload: response,
      meta
    });

    return meta.onSuccess ? dispatch(meta.onSuccess({ results: response })) : response;
  }
});
