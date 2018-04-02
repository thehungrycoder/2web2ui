/* eslint max-lines: ["error", 215] */
import { formatContactData } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import { list as getSendingIps } from './sendingIps';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import zuoraRequest from 'src/actions/helpers/zuoraRequest';
import { isAws } from 'src/helpers/conditions/account';

export function syncSubscription({ meta }) {
  return sparkpostApiRequest({
    type: 'SYNC_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/account/subscription/check',
      ...meta
    }
  });
}


/**
 * Updates plan
 * @param {string} code
 */
export function updateSubscription({ code, onSuccess }) {
  return (dispatch, getState) => {

    function refreshAccount() {
      dispatch(fetchAccount({ include: 'usage,billing' }, onSuccess));
    }

    const url = `/account/${isAws(getState()) ? 'aws-marketplace/subscription' : 'subscription'}`;

    return sparkpostApiRequest({
      type: 'UPDATE_SUBSCRIPTION',
      meta: {
        method: 'PUT',
        url: url,
        data: { code },
        onSuccess: refreshAccount
      }
    });
  };
}

/**
 * For updating billing info via our API (e.g. contact info)
 * @param {Object} data
 */
export function updateBillingContact(data) {
  const action = sparkpostApiRequest({
    type: 'UPDATE_BILLING_CONTACT',
    meta: {
      method: 'PUT',
      url: '/account/billing',
      data: formatContactData(data)
    }
  });

  return (dispatch) => dispatch(action)
    .then(() => dispatch(fetchAccount({ include: 'usage,billing' })));
}

export function cors({ meta, context, data = {}}) {
  const type = `CORS_${context.toUpperCase().replace('-', '_')}`;
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'POST',
      url: '/account/cors-data',
      params: { context },
      data,
      ...meta
    }
  });
}

export function updateCreditCard({ data, token, signature, meta }) {
  return zuoraRequest({
    type: 'ZUORA_UPDATE_CC',
    meta: {
      method: 'POST',
      url: '/payment-methods/credit-cards',
      data,
      ...meta,
      headers: { token, signature }
    }
  });
}

export function addDedicatedIps({ ip_pool, isAwsAccount, quantity }) {
  const url = isAwsAccount
    ? '/account/aws-marketplace/add-ons/dedicated_ips'
    : '/account/add-ons/dedicated_ips';
  const action = {
    type: 'ADD_DEDICATED_IPS',
    meta: {
      method: 'POST',
      url,
      data: {
        ip_pool,
        quantity: parseInt(quantity)
      }
    }
  };

  return (dispatch) => dispatch(sparkpostApiRequest(action))
    .then(() => dispatch(getSendingIps())); // refresh list
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

/**
 * attempts to collect payments (like when payment method is updated) to make sure pending payments are charged
 */

export function collectPayments({ meta }) {
  return sparkpostApiRequest({
    type: 'COLLECT_PAYMENTS',
    meta: {
      method: 'POST',
      url: '/account/billing/collect',
      ...meta
    }
  });
}

/**
 * Gets countries for billing forms
 */
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
