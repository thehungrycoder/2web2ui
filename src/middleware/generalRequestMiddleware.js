import axios from 'axios';

export default function namedFunc ({ dispatch, getState }) {
  return (next) => (action) => {
    next(action);

    if (action.type !== 'GENERAL_REQUEST') {
      return;
    }

    const { meta } = action;
    const { url, method = 'get', type = 'NO_TYPE_DEFINED', params, headers, data, onSuccess } = meta;
    const PENDING_TYPE = `${type}_PENDING`;
    const SUCCESS_TYPE = `${type}_SUCCESS`;
    const FAIL_TYPE = `${type}_FAIL`;

    dispatch({
      type: PENDING_TYPE
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
        payload: results
      });

      // if we need to chain together another action, do it here
      if (typeof onSuccess === 'function') {
        onSuccess({ dispatch, getState, results });
      }
    }, ({ message, response = {} }) => {
        // TODO: dispatch API_FAILURE_RECEIVED instead?
      dispatch({
        type: FAIL_TYPE,
        payload: { message, response }
      });
    });
  };
}
