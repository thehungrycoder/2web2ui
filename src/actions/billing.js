import { formatDataForCors, formatCreateData } from './helpers/billing';
import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest';

const apiBase = 'https://apisandbox-api.zuora.com/rest/v1';

export function updateSubscription(code) {
  return sparkpostApiRequest({
    type: 'UPDATE_SUBSCRIPTION',
    meta: {
      method: 'PUT',
      url: '/account/subscription',
      data: { code }
    }
  });
}

export function billingCreate(values) {
  const { corsData, billingData } = formatDataForCors(values);

  return (dispatch) => {
    dispatch(sparkpostApiRequest({
      type: 'CORS_CREATE',
      meta: {
        method: 'POST',
        url: '/account/cors-data',
        params: { context: 'create-account' },
        data: corsData
      }
    }))
    .then((results) => {
      const { token, signature } = results;
      const data = formatCreateData({ ...results, ...billingData });

      // TODO: Convert this to using a general request helper instead of middleware
      dispatch({
        type: 'GENERAL_REQUEST',
        meta: {
          type: 'ZUORA_CREATE',
          method: 'POST',
          url: `${apiBase}/accounts`,
          data,
          headers: { token, signature }
        }
      });
    });
  };
}

export function getBillingCountries() {
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
