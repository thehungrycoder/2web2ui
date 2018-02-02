import { formatKeyForRequest } from './helpers/api-keys';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function createApiKey(key) {
  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'CREATE_API_KEY',
      meta: {
        method: 'POST',
        url: '/api-keys',
        ...formatKeyForRequest(key, getState)
      }
    })
  );
}

export function getApiKey({ id, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'GET_API_KEY',
    meta: {
      method: 'GET',
      url: `/api-keys/${id}`,
      headers
    }
  });

}

export function deleteApiKey({ id, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'DELETE_API_KEY',
    meta: {
      method: 'DELETE',
      url: `/api-keys/${id}`,
      headers
    }
  });
}

export function updateApiKey({ id, key, subaccount = null }) {
  const headers = setSubaccountHeader(subaccount);
  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'UPDATE_API_KEY',
      meta: {
        method: 'PUT',
        url: `/api-keys/${id}`,
        ...formatKeyForRequest(key, getState),
        headers
      }
    })
  );
}

export function hideNewApiKey() {
  return {
    type: 'HIDE_NEW_API_KEY'
  };
}

export function listApiKeys(subaccount) {
  const headers = setSubaccountHeader(subaccount);

  return sparkpostApiRequest({
    type: 'LIST_API_KEYS',
    meta: {
      method: 'GET',
      url: '/api-keys',
      headers
    }
  });
}

export function listGrants() {
  return sparkpostApiRequest({
    type: 'LIST_GRANTS',
    meta: {
      method: 'GET',
      url: '/authenticate/grants'
    }
  });
}

export function listSubaccountGrants() {
  return sparkpostApiRequest({
    type: 'LIST_SUBACCOUNT_GRANTS',
    meta: {
      method: 'GET',
      url: '/authenticate/grants',
      params: {
        role: 'subaccount'
      }
    }
  });
}
