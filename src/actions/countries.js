import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function fetch() {
  return sparkpostApiRequest({
    type: 'FETCH_COUNTRIES',
    meta: {
      method: 'GET',
      url: '/account/countries'
    }
  });
}
