import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest'

export function fetch() {
  return sparkpostApiRequest({
    type: 'FETCH_COUNTRIES',
    meta: {
      method: 'GET',
      url: '/account/countries'
    }
  });
}
