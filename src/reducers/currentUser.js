const initialState = {
  grants: [],
  tfa: 'unknown'
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_CURRENT_USER_SUCCESS':
      return { ...state, ...payload };

    case 'GET_GRANTS_SUCCESS':
      return { ...state, grants: payload };

    case 'TFA_ENABLED': {
      return { ...state, tfa: 'enabled' };
    }

    case 'GET_TFA_STATUS_SUCCESS': {
      return { ...state, tfa: payload.enabled ? 'enabled' : 'disabled' };
    }

    default:
      return state;
  }
};
