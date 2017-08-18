export function fetch() {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'FETCH_COUNTRIES',
      method: 'GET',
      url: '/account/countries'
    }
  };
}
