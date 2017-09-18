import { formatDataForCors, formatCreateData } from 'helpers/billing';
import { fetch as fetchAccount } from './account';
import sparkpostApiRequest from 'actions/helpers/sparkpostApiRequest';
import zuoraRequest from 'actions/helpers/zuoraRequest';

export function syncSubscription() {
  return sparkpostApiRequest({
    type: 'SYNC_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/account/subscription/check'
    }
  });
}

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

export function corsCreate(data) {
  return sparkpostApiRequest({
    type: 'CORS_CREATE',
    meta: {
      method: 'POST',
      url: '/account/cors-data',
      params: { context: 'create-account' },
      data
    }
  });
}

export function createZuoraAccount({ data, token, signature }) {
  return zuoraRequest({
    type: 'ZUORA_CREATE',
    meta: {
      method: 'POST',
      url: '/accounts',
      data,
      headers: { token, signature }
    }
  });
}

export function billingCreate(values) {
  const { corsData, billingData } = formatDataForCors(values);

  return (dispatch) =>

    // get CORS data for the create account context
    dispatch(corsCreate(corsData))

    // create the Zuora account
    .then((results) => {
      const { token, signature } = results;
      const data = formatCreateData({ ...results, ...billingData });
      return dispatch(createZuoraAccount({ data, token, signature }));
    })

    // sync our db with new Zuora state
    .then(() => dispatch(syncSubscription()))

    // refetch the account
    .then(() => dispatch(fetchAccount()));
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
