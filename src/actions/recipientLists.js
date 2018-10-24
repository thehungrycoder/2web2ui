import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function listRecipientLists({ force } = {}) {
  return (dispatch, getState) => {
    if (!force && getState().recipientLists.listLoaded) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_RECIPIENT_LISTS',
        meta: {
          method: 'GET',
          url: '/v1/recipient-lists',
          showErrorAlert: false
        }
      })
    );
  };
}

export function createRecipientList(data) {
  return sparkpostApiRequest({
    type: 'CREATE_RECIPIENT_LIST',
    meta: {
      method: 'POST',
      url: '/v1/recipient-lists',
      data
    }
  });
}

export function updateRecipientList({ id, ...updateFields }, params) {
  return sparkpostApiRequest({
    type: 'UPDATE_RECIPIENT_LIST',
    meta: {
      method: 'PUT',
      url: `/v1/recipient-lists/${id}`,
      data: updateFields,
      id,
      params
    }
  });
}

export function deleteRecipientList(id) {
  return sparkpostApiRequest({
    type: 'DELETE_RECIPIENT_LIST',
    meta: {
      method: 'DELETE',
      url: `/v1/recipient-lists/${id}`,
      id
    }
  });
}

export function getRecipientList(id, params) {
  return sparkpostApiRequest({
    type: 'GET_RECIPIENT_LIST',
    meta: {
      method: 'GET',
      url: `/v1/recipient-lists/${id}`,
      params
    }
  });
}
