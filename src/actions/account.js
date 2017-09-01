import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest';

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
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_PLANS',
      method: 'GET',
      url: '/account/plans'
    }
  };
}
