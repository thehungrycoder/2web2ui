import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';


export function listSuppressions(params) {
  return sparkpostApiRequest({
    type: 'GET_SUPPRESSIONS',
    meta: {
      method: 'GET',
      url: '/suppression-list',
      params: params
    }
  });
}

export function searchRecipient({ email } = {}) {
  return (dispatch, getState) => dispatch(
      sparkpostApiRequest({
        type: 'SEARCH_SUPPRESSIONS_RECIPIENT',
        meta: {
          method: 'GET',
          url: `/suppression-list/${email}`
        }
      })
    );
}
