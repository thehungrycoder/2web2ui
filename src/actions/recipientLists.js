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
          url: '/recipient-lists'
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
      url: '/recipient-lists',
      data
    }
  });
}

export function updateRecipientList({ id, ...updateFields }, params) {
  return sparkpostApiRequest({
    type: 'UPDATE_RECIPIENT_LIST',
    meta: {
      method: 'PUT',
      url: `/recipient-lists/${id}`,
      data: updateFields,
      params
    }
  });
}

export function deleteRecipientList(id) {
  return sparkpostApiRequest({
    type: 'DELETE_RECIPIENT_LIST',
    meta: {
      method: 'DELETE',
      url: `/recipient-lists/${id}`,
      id
    }
  });
}

export function setCurrentRecipientList(id) {
  return {
    type: 'SET_CURRENT_RECIPIENT_LIST',
    payload: { id }
  };
}
