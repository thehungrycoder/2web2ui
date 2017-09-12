export function list() {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_SENDING_DOMAINS',
      method: 'GET',
      url: '/sending-domains'
    }
  };
}
