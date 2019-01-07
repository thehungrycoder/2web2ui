/* eslint max-lines: ["error", 215] */
import { formatContactData } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import { list as getSendingIps } from './sendingIps';
import { isAws } from 'src/helpers/conditions/account';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import zuoraRequest from 'src/actions/helpers/zuoraRequest';

export function syncSubscription({ meta = {}} = {}) {
  return sparkpostApiRequest({
    type: 'SYNC_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/v1/account/subscription/check',
      ...meta
    }
  });
}


/**
 * Updates plan
 * @param {string} code
 */
export function updateSubscription({ code, promoCode, meta = {}}) {
  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'UPDATE_SUBSCRIPTION',
      meta: {
        method: 'PUT',
        url: isAws(getState()) ? '/v1/account/aws-marketplace/subscription' : '/v1/account/subscription',
        data: {
          promo_code: promoCode,
          code
        },
        ...meta,
        onSuccess: meta.onSuccess ? meta.onSuccess : () => fetchAccount({ include: 'usage,billing' })
      }
    })
  );
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
      url: '/v1/account/billing',
      data: formatContactData(data)
    }
  });

  return (dispatch) => dispatch(action)
    .then(() => dispatch(fetchAccount({ include: 'usage,billing' })));
}

export function verifyPromoCode({ promoCode, billingId, meta = {}}) {
  return sparkpostApiRequest({
    type: 'VERIFY_PROMO_CODE',
    meta: {
      method: 'GET',
      url: `v1/account/subscription/promo-codes/${promoCode}`,
      params: {
        billing_id: billingId
      },
      ...meta
    }
  });
}

export function clearPromoCode() {
  return { type: 'REMOVE_ACTIVE_PROMO' };
}

export function cors({ meta = {}, context, data = {}}) {
  const type = `CORS_${context.toUpperCase().replace('-', '_')}`;
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'POST',
      url: '/v1/account/cors-data',
      params: { context },
      data,
      ...meta
    }
  });
}

export function updateCreditCard({ data, token, signature, meta = {}}) {
  return zuoraRequest({
    type: 'ZUORA_UPDATE_CC',
    meta: {
      method: 'POST',
      url: '/payment-methods/credit-cards',
      data,
      headers: { token, signature },
      ...meta
    }
  });
}

export function addDedicatedIps({ ip_pool, isAwsAccount, quantity }) {
  const url = isAwsAccount
    ? '/v1/account/aws-marketplace/add-ons/dedicated_ips'
    : '/v1/account/add-ons/dedicated_ips';
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

export function createZuoraAccount({ data, token, signature, meta = {}}) {
  return zuoraRequest({
    type: 'ZUORA_CREATE',
    meta: {
      method: 'POST',
      url: '/accounts',
      data,
      headers: { token, signature },
      ...meta
    }
  });
}

/**
 * attempts to collect payments (like when payment method is updated) to make sure pending payments are charged
 */
export function collectPayments({ meta = {}}) {
  return sparkpostApiRequest({
    type: 'COLLECT_PAYMENTS',
    meta: {
      method: 'POST',
      url: '/v1/account/billing/collect',
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
      url: '/v1/account/countries',
      params: {
        filter: 'billing'
      }
    }
  });
}
