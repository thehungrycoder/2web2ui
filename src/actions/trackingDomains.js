import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { apiResponseToAlert } from 'src/helpers/apiMessages';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import { showAlert } from './globalAlert';

export function listTrackingDomains(subaccount = null) {
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
  return (dispatch) => dispatch(sparkpostApiRequest({
    type: 'CREATE_TRACKING_DOMAIN',
    meta: {
      method: 'POST',
      url: '/tracking-domains',
      data,
      headers
    }
  }))
    .then(() => dispatch(showAlert({ type: 'success', message: `Successfully added ${data.domain}` })))
    .catch((err) => dispatch(showAlert(apiResponseToAlert(err, `Unable to add ${data.domain}`))));
}

export function updateTrackingDomain({ domain, subaccount = null, ...data }) {
  const headers = setSubaccountHeader(subaccount);
  return (dispatch) => dispatch(sparkpostApiRequest({
    type: 'UPDATE_TRACKING_DOMAIN',
    meta: {
      method: 'PUT',
      url: `/tracking-domains/${domain}`,
      data,
      headers,
      domain
    }
  }))
    .then(() => dispatch(showAlert({ type: 'success', message: `Successfully updated ${domain}` })))
    .catch(() => dispatch(showAlert({ type: 'error', message: `Unable to update ${domain}` })));
}

export function deleteTrackingDomain({ domain, subaccountId }) {
  const headers = setSubaccountHeader(subaccountId);
  return (dispatch) => dispatch(sparkpostApiRequest({
    type: 'DELETE_TRACKING_DOMAIN',
    meta: {
      method: 'DELETE',
      url: `/tracking-domains/${domain}`,
      headers,
      domain
    }
  }))
    .then(() => dispatch(showAlert({ type: 'success', message: `Successfully deleted ${domain}` })))
    .catch(() => dispatch(showAlert({ type: 'error', message: `Unable to delete ${domain}` })));
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
