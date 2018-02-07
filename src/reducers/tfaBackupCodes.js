const initialState = { codes: [], error: null, pending: false };

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

    case 'TFA_CLEAR_BACKUP_CODES': {
      return { ...state, codes: []};
    }

    default: {
      return state;
    }
  }
};
