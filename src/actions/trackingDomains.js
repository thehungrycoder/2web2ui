import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import _ from 'lodash';

export function listTrackingDomains() {
  return sparkpostApiRequest({
    type: 'LIST_TRACKING_DOMAINS',
    meta: {
      method: 'GET',
      url: '/tracking-domains'
    }
  });
}

export function createTrackingDomain({ subaccount = null, ...data }) {
  const headers = {};
  if (subaccount !== null) {
    headers['x-msys-subaccount'] = _.get(subaccount, 'id', subaccount);
  }
  return sparkpostApiRequest({
    type: 'CREATE_TRACKING_DOMAIN',
    meta: {
      method: 'POST',
      url: '/tracking-domains',
      data,
      headers
    }
  });
}

export function deleteTrackingDomain({ domain, subaccountId }) {
  const headers = {};
  if (typeof subaccountId === 'number') {
    headers['x-msys-subaccount'] = subaccountId;
  }
  return (dispatch) => {
    dispatch(sparkpostApiRequest({
      type: 'DELETE_TRACKING_DOMAIN',
      meta: {
        method: 'DELETE',
        url: `/tracking-domains/${domain}`,
        headers,
        domain
      }
    })).then(() => {
      // dispatch success alert?
    });
  };
}

export function verifyTrackingDomain({ domain, subaccountId }) {
  const headers = {};
  if (typeof subaccountId === 'number') {
    headers['x-msys-subaccount'] = subaccountId;
  }
  return sparkpostApiRequest({
    type: 'VERIFY_TRACKING_DOMAIN',
    meta: {
      method: 'POST',
      url: `/tracking-domains/${domain}/verify`,
      headers,
      domain
    }
  });
}
