import config from 'config/index';
import requestFactory from './requestFactory';
import axios from 'axios';
import _ from 'lodash';

const zuoraRequest = axios.create({
  baseURL: config.zuora.baseUrl,
  timeout: config.zuora.timeout
});

export default requestFactory({
  request: zuoraRequest,
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
