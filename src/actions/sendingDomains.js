import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from 'src/actions/helpers/setSubaccountHeader';

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
      url: `/sending-domains/${id}`,
      id
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

export function update({ id, subaccount, ...data }) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'UPDATE_SENDING_DOMAIN',
    meta: {
      method: 'PUT',
      url: `/sending-domains/${id}`,
      data,
      headers
    }
  });
}

export function remove({ id, subaccount }) {
  return sparkpostApiRequest({
    type: 'DELETE_SENDING_DOMAIN',
    meta: {
      method: 'DELETE',
      url: `/sending-domains/${id}`,
      headers: setSubaccountHeader(subaccount)
    }
  });
}

export function verify({ id, subaccount, type, options = {}}) {
  return sparkpostApiRequest({
    type: `VERIFY_SENDING_DOMAIN_${type.toUpperCase()}`,
    meta: {
      method: 'POST',
      url: `/sending-domains/${id}/verify`,
      headers: setSubaccountHeader(subaccount),
      data: {
        ...options,
        [`${type}_verify`]: true
      }
    }
  });
}

export function verifyAbuse({ id, subaccount }) {
  return verify({ id, subaccount, type: 'abuse_at' });
}

export function verifyCname({ id, subaccount }) {
  return verify({ id, subaccount, type: 'cname' });
}

export function verifyDkim({ id, subaccount }) {
  return verify({ id, subaccount, type: 'dkim' });
}

export function verifyMailbox({ id, mailbox, subaccount }) {
  return verify({
    id, subaccount,
    type: 'verification_mailbox',
    options: {
      verification_mailbox: mailbox
    }
  });
}

export function verifyPostmaster({ id, subaccount }) {
  return verify({ id, subaccount, type: 'postmaster_at' });
}
