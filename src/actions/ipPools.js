import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function list() {
  return sparkpostApiRequest({
    type: 'LIST_IP_POOLS',
    meta: {
      method: 'GET',
      url: '/ip-pools'
    }
  });
}
export function create(name) {
  return sparkpostApiRequest({
    type: 'CREATE_IP_POOL',
    meta: {
      method: 'POST',
      url: '/ip-pools',
      data: { name }
    }
  });
}
