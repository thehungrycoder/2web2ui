import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function get() {
  return (dispatch, getState) => {
    const { username } = getState().auth;
    return dispatch(sparkpostApiRequest({
      type: 'GET_CURRENT_USER',
      meta: {
        method: 'GET',
        url: `/users/${username}`
      }
    }));
  };
}

export function getGrants({ beta = false, role } = {}) {
  return sparkpostApiRequest({
    type: 'GET_GRANTS',
    meta: {
      url: '/authenticate/grants',
      params: { beta, role }
    }
  });
}
