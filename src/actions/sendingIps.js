import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function updateSendingIp(id, ipPoolName) {
  return sparkpostApiRequest({
    type: 'UPDATE_SENDING_IP',
    meta: {
      method: 'PUT',
      url: `/v1/sending-ips/${id}`,
      data: { ip_pool: ipPoolName }
    }
  });
}

export function list() {
  return sparkpostApiRequest({
    type: 'LIST_SENDING_IPS',
    meta: {
      method: 'GET',
      url: '/v1/sending-ips'
    }
  });
}
