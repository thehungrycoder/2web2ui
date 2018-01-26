import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function list() {
  return sparkpostApiRequest({
    type: 'LIST_SENDING_DOMAINS',
    meta: {
      method: 'GET',
      url: '/sending-domains'
    }
  });
}

export function get(id) {
  return sparkpostApiRequest({
    type: 'GET_SENDING_DOMAIN',
    meta: {
      method: 'GET',
      url: `/sending-domains/${id}`
    }
  });
}

export function create(data) {
  const { assignTo, subaccount, ...formData } = data;

  return sparkpostApiRequest({
    type: 'CREATE_SENDING_DOMAIN',
    meta: {
      method: 'POST',
      url: '/sending-domains',
      headers: setSubaccountHeader(subaccount),
      data: { ...formData, shared_with_subaccounts: assignTo === 'shared' }
    }
  });
}

export function verify(id, type) {
  const data = {};
  data[`${type}_verify`] = true;

  return sparkpostApiRequest({
    type: 'VERIFY_SENDING_DOMAIN',
    meta: {
      method: 'POST',
      url: `/sending-domains/${id}/verify`,
      data
    }
  });
}

export function update(id, data) {
  return sparkpostApiRequest({
    type: 'UPDATE_SENDING_DOMAIN',
    meta: {
      method: 'PUT',
      url: `/sending-domains/${id}`,
      data
    }
  });
}
