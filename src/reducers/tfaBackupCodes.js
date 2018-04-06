const initialState = { codes: [], error: null, pending: false, activeCount: 0 };

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case 'TFA_GENERATE_BACKUP_CODES_PENDING': {
      return { ...state, error: null, pending: true };
    }

    case 'TFA_GENERATE_BACKUP_CODES_FAIL': {
      return { ...state, error: payload, pending: false };
    }

    case 'TFA_GENERATE_BACKUP_CODES_SUCCESS': {
      return { ...state, pending: false, codes: payload.codes };
    }

    case 'TFA_TOGGLE_SUCCESS': {
      // we want to clear out codes in store if you're disabling
      // to avoid hard refresh
      if (payload.enabled === false) {
        return { ...state, activeCount: 0 };
      }

      return state;
    }

    case 'TFA_CLEAR_BACKUP_CODES': {
      return { ...state, codes: []};
    }

    case 'GET_TFA_BACKUP_STATUS_SUCCESS': {
      return { ...state, activeCount: payload.active || state.activeCount };
    }

    default: {
      return state;
    }
  }
};
