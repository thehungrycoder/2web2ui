const initialState = { tfaEnabled: false, tfaPending: false, backupCodes: []};

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

    case 'TFA_GENERATE_BACKUP_CODES_PENDING': {
      return { ...state, backupCodesError: null, backupCodesPending: true };
    }

    case 'TFA_GENERATE_BACKUP_CODES_FAIL': {
      return { ...state, backupCodesError: action.payload, backupCodesPending: false };
    }

    case 'TFA_GENERATE_BACKUP_CODES_SUCCESS': {
      return { ...state, backupCodesPending: false, backupCodes: action.payload.codes };
    }

    case 'TFA_CLEAR_BACKUP_CODES': {
      return { ...state, backupCodes: []};
    }

    default: {
      return state;
    }
  }
};
