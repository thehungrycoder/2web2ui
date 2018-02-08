const initialState = { codes: [], error: null, pending: false, hasCodes: false, activeCodes: 0 };

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

    case 'GET_TFA_BACKUP_STATUS_SUCCESS': {
      return { ...state, hasCodes: payload.enabled, activeCodes: payload.active || state.activeCodes };
    }

    default: {
      return state;
    }
  }
};
