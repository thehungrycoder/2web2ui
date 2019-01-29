import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function listAlerts() {
  return sparkpostApiRequest({
    type: 'LIST_ALERTS',
    meta: {
      method: 'GET',
      url: '/v1/alerts',
      showErrorAlert: false
    }
  });
}

export function createAlert({ data }) {
  return sparkpostApiRequest({
    type: 'CREATE_ALERT',
    meta: {
      method: 'POST',
      url: '/v1/alerts',
      data
    }
  });
}

export function updateAlert({ id, data }) {
  return sparkpostApiRequest({
    type: 'UPDATE_ALERT',
    meta: {
      method: 'PUT',
      url: `/v1/alerts/${id}`,
      data
    }
  });
}

export function deleteAlert({ id }) {
  return sparkpostApiRequest({
    type: 'DELETE_ALERT',
    meta: {
      method: 'DELETE',
      url: `/v1/alerts/${id}`
    }
  });
}
