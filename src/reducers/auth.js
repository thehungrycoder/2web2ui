
const initialState = { loggedIn: false, ssoUser: undefined };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_PENDING': {
      return { ...state, errorDescription: null, loginPending: true };
    }

    case 'LOGIN_SUCCESS': {
      const {
        access_token: token,
        username = state.username,
        refresh_token: refreshToken
      } = action.payload;

      return {
        ...state,
        loginPending: false,
        token,
        username,
        refreshToken,
        loggedIn: true
      };
    }

    case 'LOGIN_FAIL': {
      const { errorDescription = 'An unknown error occurred' } = action.payload;
      return { loggedIn: false, errorDescription };
    }

    case 'LOGOUT': {
      return { loggedIn: false };
    }

    case 'SSO_CHECK_PENDING': {
      return { ...state, errorDescription: null, loginPending: true };
    }

    case 'SSO_CHECK_SUCCESS': {
      const { saml: ssoUser } = action.payload;

      if (ssoUser) {
        return { ...state, ssoUser }; //loginPending unchanged (true)to keep loading state on while redirecting
      } else {
        return { ...state, ssoUser, loginPending: false };
      }
    }

    case 'SSO_CHECK_FAIL': {
      const { message: errorDescription = 'An unknown error occurred' } = action.payload;
      return { loginPending: false, errorDescription, ssoUser: false };
    }

    default: {
      return state;
    }
  }
};
