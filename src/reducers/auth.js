const initialState = { loggedIn: false };

export default (state = initialState, action) => {
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
    
    default:
      return state;
  }
}