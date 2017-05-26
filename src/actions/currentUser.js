export function fetch() {
  return (dispatch, getState) => {
    const { username } = getState().auth;
    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'FETCH_CURRENT_USER',
        method: 'GET',
        url: `/users/${username}`
      }
    });
  }
  
}