const initialState = {
  valid: true,
  url: null,
  precancelLoading: false
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'BRIGHTBACK_PRECANCEL_PENDING':
      return { ...state, precancelLoading: true, valid: false, url: null };

    case 'BRIGHTBACK_PRECANCEL_FAIL':
      return { ...state, precancelLoading: false };

    case 'BRIGHTBACK_PRECANCEL_SUCCESS':
      return { ...state, precancelLoading: false, ...payload };

    default:
      return state;
  }
};
