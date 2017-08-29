export function fetch (params = {}) {
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

export function getPlans () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_PLANS',
      method: 'GET',
      url: '/account/plans'
    }
  };
}

export function getBillingCountries () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_COUNTRIES_BILLING',
      method: 'GET',
      url: '/account/countries',
      params: {
        filter: 'billing'
      }
    }
  };
}
