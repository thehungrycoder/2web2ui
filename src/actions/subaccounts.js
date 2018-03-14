import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { formatSubaccount } from './helpers/subaccounts';

export function list() {
  return sparkpostApiRequest({
    type: 'LIST_SUBACCOUNTS',
    meta: {
      method: 'GET',
      url: '/subaccounts',
      showErrorAlert: false
    }
  });
}

export function create(values) {
  return (dispatch, getState) => dispatch(
    sparkpostApiRequest({
      type: 'CREATE_SUBACCOUNT',
      meta: {
        method: 'POST',
        url: '/subaccounts',
        data: { ...formatSubaccount(values, getState) }
      }
    })
  ).then((res) => {
    // need to update store for api key creation during subaccount
    if (res.key) {
      dispatch({
        type: 'CREATE_API_KEY_SUCCESS',
        payload: { key: res.key }
      });
    }

    return res;
  });
}

export function getSubaccount(id) {
  return sparkpostApiRequest({
    type: 'GET_SUBACCOUNT',
    meta: {
      method: 'GET',
      url: `subaccounts/${id}`
    }
  });
}

export function editSubaccount(id, data) {
  return sparkpostApiRequest({
    type: 'EDIT_SUBACCOUNT',
    meta: {
      method: 'PUT',
      url: `subaccounts/${id}`,
      data: data
    }
  });
}
