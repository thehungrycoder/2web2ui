export default (state, action) => {
  switch(action.type) {
    case 'LOGIN_PENDING':
      return { ...state, error_description: null }
      
    case 'LOGIN_SUCCESS':
      const { token, username = state.username, refresh_token } = action.payload;
      return {
        token,
        username,
        refresh_token,
        loggedIn: true
      };
      
    case 'LOGIN_FAIL':
      return {
        ...action.payload,
        loggedIn: false
      }

    default:
      return { loggedIn: false, unknown: true };
  }
}