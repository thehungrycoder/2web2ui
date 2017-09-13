import { formatDataForCors, formatCreateData } from './helpers/billing';
import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest';
import generalRequest from 'actions/helpers/generalRequest';

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
      return dispatch(generalRequest({
        type: 'ZUORA_CREATE',
        meta: {
          method: 'POST',
          url: `${apiBase}/accounts`,
          data,
          headers: { token, signature }
        }
      }));
    });
  };
}

export function getBillingCountries() {
  return sparkpostApiRequest({
    type: 'GET_COUNTRIES_BILLING',
    meta: {
      method: 'GET',
      url: '/account/countries',
      params: {
        filter: 'billing'
      }
    }
  });
}
