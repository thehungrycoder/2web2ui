export default (state, action) => {
  switch(action.type) {
    case 'LOGIN_PENDING':
      return { ...state, error_description: null, loginPending: true }
      
    case 'LOGIN_SUCCESS':
      const { access_token: token, username = state.username, refresh_token: refreshToken } = action.payload;
      return {
        token,
        username,
        refreshToken,
        loggedIn: true
      };
      
    case 'LOGIN_FAIL':
      return {
        ...action.payload,
        loggedIn: false
      }

    default:
      return { loggedIn: false, redirectPath: null };
  }
}