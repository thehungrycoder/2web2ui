export default (state, action) => {
  switch(action.type) {
    case 'LOGIN_PENDING':
      return { ...state, error_description: null, loginPending: true }
      
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
    
    // case 'AUTH_REDIRECT':
    //   return {
    //     ...state,
    //     redirectPath: action.payload.path
    //   }
    // 
    // case 'CLEAR_AUTH_REDIRECT':
    //   return {
    //     ...state,
    //     redirectPath: null
    //   }

    default:
      return { loggedIn: false, redirectPath: null };
  }
}