export function fetch(params = {}) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'FETCH_ACCOUNT',
      method: 'GET',
      url: '/account',
      params
    }
  };
}
