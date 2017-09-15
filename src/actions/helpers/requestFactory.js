import axios from 'axios';

function defaultOnSuccess({ types, response, dispatch, meta, action }) {
  dispatch({
    type: types.SUCCESS,
    payload: response,
    meta
  });

  return response;
}

function defaultOnFail({ types, err, dispatch, meta, action }) {
  const { message, response = {}} = err;

  dispatch({
    type: types.FAIL,
    payload: { message, response },
    meta
  });

  return { error: true };
}

export default function requestFactory({
  request = axios,
  onSuccess = defaultOnSuccess,
  onFail = defaultOnFail,
  transformHttpOptions = (opts) => opts
} = {}) {
  return (action) => (dispatch, getState) => {
    const { type = 'NO_TYPE_DEFINED', meta } = action;
    const { url, method = 'get', params, headers, data } = meta;
    const types = {
      PENDING: `${type}_PENDING`,
      SUCCESS: `${type}_SUCCESS`,
      FAIL: `${type}_FAIL`
    };

    dispatch({
      type: types.PENDING,
      meta
    });

    const httpOptions = {
      method: method.toLowerCase(),
      url,
      params,
      headers,
      data
    };

    const transformedHttpOptions = transformHttpOptions(httpOptions, getState);

    return request(transformedHttpOptions)
      .then(
        // request succeeded, we only get here if the request returned a 2xx status code
        (response) => onSuccess({ types, response, dispatch, meta, action, getState }),

        // request failed
        (err) => {
          onFail({ types, err, dispatch, meta, action, getState });
          err.handled = true;
          throw err;
        }
      )
      .catch((err) => {
        // this is an HTTP rejection but we usually won't care because we "handled" it
        // by dispatching a fail action ... but for chaining we need to re-throw those errors in
        // case we want to catch and do something else on error later...

        // check for handled prop that tells us we know about this error, and if not there, re-throw
        if (!err.handled) {
          throw err;
        }
      });
  };
}
