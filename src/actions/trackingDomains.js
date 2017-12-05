import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function listTrackingDomains() {
  return sparkpostApiRequest({
    type: 'LIST_TRACKING_DOMAINS',
    meta: {
      method: 'GET',
      url: '/tracking-domains'
    }
  });
}

export function createTrackingDomain({ subaccount, ...data }) {
  const headers = setSubaccountHeader(subaccount);
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
  const headers = setSubaccountHeader(subaccountId);
  return (dispatch) => {
    dispatch(sparkpostApiRequest({
      type: 'DELETE_TRACKING_DOMAIN',
      meta: {
        method: 'DELETE',
        url: `/tracking-domains/${domain}`,
        headers,
        domain
      }
    }));
  };
}

export function verifyTrackingDomain({ domain, subaccountId }) {
  const headers = setSubaccountHeader(subaccountId);
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
