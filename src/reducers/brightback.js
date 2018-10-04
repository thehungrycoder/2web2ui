const initialState = {
  metrics: null,
  valid: false,
  url: null
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'BRIGHTBACK_METRICS_SUCCESS':
      return { ...state, metrics: payload };

    case 'BRIGHTBACK_PRECANCEL_PENDING':
      return { ...state, ...initialState };

    case 'BRIGHTBACK_PRECANCEL_SUCCESS':
      return { ...state, ...payload };

    default:
      return state;
  }
};
