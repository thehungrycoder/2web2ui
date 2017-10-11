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
