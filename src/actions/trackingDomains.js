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

export function createTrackingDomain({ subaccount = {}, ...data }) {
  const headers = {};
  if (typeof subaccount === 'number') {
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
