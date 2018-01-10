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
  return (dispatch) => dispatch(
    sparkpostApiRequest({
      type: 'CREATE_RECIPIENT_LIST',
      meta: {
        method: 'POST',
        url: '/recipient-lists',
        data
      }
    })
  );
}

