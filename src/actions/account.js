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
