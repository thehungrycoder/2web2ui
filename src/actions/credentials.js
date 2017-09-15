import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function fetchApiKeys() {
  return (dispatch, getState) => {
    if (getState().credentials.keys.length) {
      return;
    }

    return dispatch(sparkpostApiRequest({
      type: 'FETCH_API_KEYS',
      meta: {
        method: 'GET',
        url: '/api-keys'
      }
    }));
  };
}
