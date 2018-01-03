const initialState = { tfaEnabled: false, tfaPending: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'TFA_ENABLED': {
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
        tfaEnabled: true
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

    default: {
      return state;
    }
  }
};
