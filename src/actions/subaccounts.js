export function list() {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_SUBACCOUNTS',
      method: 'GET',
      url: '/subaccounts'
    }
  };
}
