import { formatKeyForRequest } from './helpers/api-keys';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { showAlert } from './globalAlert';

export function createApiKey(key) {
  return (dispatch, getState) =>
    dispatch(
      sparkpostApiRequest({
        type: 'CREATE_API_KEY',
        meta: {
          method: 'POST',
          url: '/api-keys',
          ...formatKeyForRequest(key, getState)
        }
      })
    )
      .then(() =>
        dispatch(showAlert({ type: 'success', message: 'API key created' }))
      )
      .catch((err) =>
        dispatch(
          showAlert({
            type: 'error',
            message: 'Could not create API key',
            details: err.message
          })
        )
      );
}

export function deleteApiKey(id) {
  return (dispatch) =>
    dispatch(
      sparkpostApiRequest({
        type: 'DELETE_API_KEY',
        meta: {
          method: 'DELETE',
          url: `/api-keys/${id}`
        }
      })
    )
      .then(() =>
        dispatch(showAlert({ type: 'success', message: 'API key deleted' }))
      )
      .catch((err) =>
        dispatch(
          showAlert({
            type: 'error',
            message: 'Could not delete API key',
            details: err.message
          })
        )
      );
}

export function updateApiKey(id, key) {
  return (dispatch, getState) =>
    dispatch(
      sparkpostApiRequest({
        type: 'UPDATE_API_KEY',
        meta: {
          method: 'PUT',
          url: `/api-keys/${id}`,
          ...formatKeyForRequest(key, getState)
        }
      })
    )
      .then(() =>
        dispatch(showAlert({ type: 'success', message: 'API key updated' }))
      )
      .catch((err) =>
        dispatch(
          showAlert({
            type: 'error',
            message: 'Could not update API key',
            details: err.message
          })
        )
      );
}

export function hideNewApiKey() {
  return {
    type: 'HIDE_NEW_API_KEY'
  };
}

export function listApiKeys({ force } = {}) {
  return (dispatch, getState) => {
    if (!force && getState().apiKeys.keysLoaded) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_API_KEYS',
        meta: {
          method: 'GET',
          url: '/api-keys'
        }
      })
    );
  };
}

export function listGrants({ force } = {}) {
  return (dispatch, getState) => {
    if (!force && getState().apiKeys.grantsLoaded) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_GRANTS',
        meta: {
          method: 'GET',
          url: '/authenticate/grants'
        }
      })
    );
  };
}
