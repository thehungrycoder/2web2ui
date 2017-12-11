const initialState = {
  reasons: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_DELAY_REASONS_BY_DOMAIN_PENDING':
      return { ...state, reasonsLoading: true };

    case 'FETCH_METRICS_DELAY_REASONS_BY_DOMAIN_SUCCESS':
    case 'FETCH_METRICS_DELAY_REASONS_BY_DOMAIN_FAIL':
      return { ...state, reasonsLoading: false };

    case 'REFRESH_DELAY_TABLE':
      return { ...state, reasons: payload.reasons, reasonsLoading: false };

    default:
      return state;
  }
};
