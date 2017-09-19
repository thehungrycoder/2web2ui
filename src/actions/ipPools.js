import sparkpostApiRequest from './helpers/sparkpostApiRequest';

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
