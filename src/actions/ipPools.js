import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function listPools() {
  return sparkpostApiRequest({
    type: 'LIST_IP_POOLS',
    meta: {
      method: 'GET',
      url: '/ip-pools'
    }
  });
}

export function createPool({ name }) {
  return sparkpostApiRequest({
    type: 'CREATE_IP_POOL',
    meta: {
      method: 'POST',
      url: '/ip-pools',
      data: { name }
    }
  });
}

export function updatePool(data, params = {}) {
  return sparkpostApiRequest({
    type: 'UPDATE_IP_POOL',
    meta: {
      method: 'PUT',
      url: `/ip-pools/${data.id}`,
      data,
      params: { ...params }
    }
  });
}

export function deletePool(id) {
  return sparkpostApiRequest({
    type: 'DELETE_IP_POOL',
    meta: {
      method: 'DELETE',
      url: `/ip-pools/${id}`
    }
  });
}


export function getPool(id) {
  return sparkpostApiRequest({
    type: 'GET_IP_POOL',
    meta: {
      method: 'GET',
      url: `/ip-pools/${id}`
    }
  });
}


