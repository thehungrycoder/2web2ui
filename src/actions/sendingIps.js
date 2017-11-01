import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function updateSendingIp(id, ipPoolName) {
  return sparkpostApiRequest({
    type: 'UPDATE_SENDING_IP',
    meta: {
      method: 'PUT',
      url: `/sending-ips/${id}`,
      data: { ip_pool: ipPoolName }
    }
  });
}
