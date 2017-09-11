export function fetchApiKeys() {
  return (dispatch, getState) => {
    if (getState().credentials.keys.length) {
      return;
    }

    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'FETCH_API_KEYS',
        method: 'GET',
        url: '/api-keys'
      }
    });
  };
}
