const initialState = {
  valid: true,
  url: null,
  precancelLoading: false
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'BRIGHTBACK_PRECANCEL_PENDING':
      return { ...state, precancelLoading: true };

    case 'BRIGHTBACK_PRECANCEL_FAIL':
    case 'BRIGHTBACK_PRECANCEL_SUCCESS':
      return { ...state, precancelLoading: false };

    default:
      return state;
  }
};
