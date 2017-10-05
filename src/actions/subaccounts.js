import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function list({ force } = {}) {
  return (dispatch, getState) => {
    if (!force && getState().subaccounts.listLoaded) {
      return;
    }

    return dispatch(
      sparkpostApiRequest({
        type: 'LIST_SUBACCOUNTS',
        meta: {
          method: 'GET',
          url: '/subaccounts'
        }
      })
    );
  };
}
