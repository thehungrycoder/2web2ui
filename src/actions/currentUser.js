import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function fetch() {
  return (dispatch, getState) => {
    const { username } = getState().auth;
    dispatch(sparkpostApiRequest({
      type: 'FETCH_CURRENT_USER',
      meta: {
        method: 'GET',
        url: `/users/${username}`
      }
    }));
  };
}
