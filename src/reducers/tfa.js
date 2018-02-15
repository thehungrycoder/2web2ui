const initialState = { enabled: null, pending: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TFA_ENABLED_ON_LOGIN': {
      const {
        access_token: token,
        username = state.username,
        refresh_token: refreshToken
      } = action.payload;

      return {
        ...state,
        token,
        username,
        refreshToken,
        enabled: true
      };
    }

    case 'TFA_VERIFICATION_PENDING': {
      return { ...state, tfaPending: true };
    }

    case 'TFA_VERIFICATION_SUCCESS': {
      return { ...state, tfaPending: false };
    }

    case 'TFA_VERIFICATION_FAIL': {
      const { errorDescription = 'An unknown error occurred' } = action.payload;
      return { ...state, tfaPending: false, errorDescription };
    }


    case 'GET_TFA_STATUS_SUCCESS': {
      return { ...state, enabled: action.payload.enabled };
    }


    case 'GET_TFA_SECRET_PENDING': {
      return { ...state, secretError: null };
    }

    case 'GET_TFA_SECRET_FAIL': {
      return { ...state, secretError: action.payload };
    }

    case 'GET_TFA_SECRET_SUCCESS': {
      return { ...state, secret: action.payload.secret };
    }


    case 'TFA_TOGGLE_PENDING': {
      return { ...state, togglePending: true, toggleError: null };
    }
    case 'TFA_TOGGLE_FAIL': {
      return { ...state, toggleError: action.payload, togglePending: false };
    }
    case 'TFA_TOGGLE_SUCCESS': {
      return { ...state, enabled: action.payload.enabled, togglePending: false };
    }


    default: {
      return state;
    }
  }
};
