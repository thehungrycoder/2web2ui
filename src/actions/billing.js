/* eslint max-lines: ["error", 200] */
import { formatDataForCors, formatCreateData, formatUpdateData, formatContactData } from 'src/helpers/billing';
import { fetch as fetchAccount } from './account';
import { list as getSendingIps } from './sendingIps';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import zuoraRequest from 'src/actions/helpers/zuoraRequest';

export function syncSubscription() {
  return sparkpostApiRequest({
    type: 'SYNC_SUBSCRIPTION',
    meta: {
      method: 'POST',
      url: '/account/subscription/check'
    }
  });
}

/**
 * Updates plan
 * @param {string} code
 */
export function updateSubscription(code, isAwsAccount = false) {
  const action = sparkpostApiRequest({
    type: 'UPDATE_SUBSCRIPTION',
    meta: {
      method: 'PUT',
      url: `/account/${isAwsAccount ? 'aws-marketplace/' : ''}subscription`,
      data: { code }
    }
  });

  return (dispatch) => dispatch(action)
    .then(() => dispatch(fetchAccount({ include: 'usage,billing' })));
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

export function cors(context, data = {}) {
  const type = `CORS_${context.toUpperCase().replace('-', '_')}`;
  return sparkpostApiRequest({
    type,
    meta: {
      method: 'POST',
      url: '/account/cors-data',
      params: { context },
      data
    }
  });
}

export function updateCreditCard({ data, token, signature }) {
  return zuoraRequest({
    type: 'ZUORA_UPDATE_CC',
    meta: {
      method: 'POST',
      url: '/payment-methods/credit-cards',
      data,
      headers: { token, signature }
    }
  });
}

export function addDedicatedIps({ ip_pool, isAWSAccount, quantity }) {
  const url = isAWSAccount
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

export function billingCreate(values) {
  const { corsData, billingData } = formatDataForCors(values);

  return (dispatch) =>

    // get CORS data for the create account context
    dispatch(cors('create-account', corsData))

      // create the Zuora account
      .then((results) => {
        const { token, signature } = results;
        const data = formatCreateData({ ...results, ...billingData });
        return dispatch(createZuoraAccount({ data, token, signature }));
      })

      // sync our db with new Zuora state
      .then(() => dispatch(syncSubscription()))

      // refetch the account
      .then(() => dispatch(fetchAccount({ include: 'usage,billing' })));
}

// note: this action creator should detect
// 1. if payment info is present, contact zuora first
// 2. otherwise it's just a call to our API + sync + refetch
//
// call this action creator from the "free -> paid" form if account.billing is present
export function billingUpdate(values) {

  return (dispatch) =>

    // get CORS data for the update billing context
    dispatch(cors('update-billing'))

      // Update Zuora with new CC
      .then(({ accountKey, token, signature }) => {
        const data = formatUpdateData({ ...values, accountKey });
        return dispatch(updateCreditCard({ data, token, signature }));
      })

      // change plan via our API if plan is included
      .then(() => {
        if (values.planpicker) {
          dispatch(updateSubscription(values.planpicker.code));
        }
      })

      // sync our db with new Zuora state
      .then(() => dispatch(syncSubscription()))

      // refetch the account
      .then(() => dispatch(fetchAccount({ include: 'usage,billing' })));
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
