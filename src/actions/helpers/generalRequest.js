import axios from 'axios';

export default function generalRequest(action) {
  return (dispatch, getState) => {
    const { type = 'NO_TYPE_DEFINED', meta } = action;
    const { url, method = 'get', params, headers, data } = meta;
    const PENDING_TYPE = `${type}_PENDING`;
    const SUCCESS_TYPE = `${type}_SUCCESS`;
    const FAIL_TYPE = `${type}_FAIL`;

    dispatch({
      type: PENDING_TYPE,
      meta
    });

    const httpOptions = {
      method: method.toLowerCase(),
      url,
      params,
      headers,
      data
    };

    return axios(httpOptions).then((results) => {
      // we only get here if the request returned a 2xx status code
      dispatch({
        type: SUCCESS_TYPE,
        payload: results,
        meta
      });

      return results;
    }, ({ message, response = {}}) => {
        // TODO: dispatch API_FAILURE_RECEIVED instead?
      dispatch({
        type: FAIL_TYPE,
        payload: { message, response },
        meta
      });
    });
  };
}
