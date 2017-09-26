import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function fetch(params = {}) {
  return sparkpostApiRequest({
    type: 'FETCH_ACCOUNT',
    meta: {
      method: 'GET',
      url: '/account',
      params
    }
  });
}

export function getPlans() {
  return sparkpostApiRequest({
    type: 'GET_PLANS',
    meta: {
      method: 'GET',
      url: '/account/plans'
    }
  });
}
