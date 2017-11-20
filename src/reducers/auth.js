import config from 'src/config';

const initialState = { loggedIn: false, ssoEnabled: config.sso.enabled === true };

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

    case 'SSO_CHECK': {
      return { ...state, errorDescription: null, loginPending: true };
    }

    case 'SSO_CHECK_SUCCESS': {
      return { ...state, ssoEnabled: action.payload.saml, loginPending: false };
    }

    case 'SSO_CHECK_FAIL': {
      const { errorDescription = 'An unknown error occurred' } = action.payload;
      return { loginPending: false, errorDescription, ssoEnabled: false };
    }

    default: {
      return state;
    }
  }
};
