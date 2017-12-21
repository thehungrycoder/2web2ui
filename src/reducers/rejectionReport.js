const initialState = {
  list: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_REJECTION_REASONS_BY_DOMAIN_PENDING':
      return { ...state, reasonsLoading: true };

    case 'FETCH_METRICS_REJECTION_REASONS_BY_DOMAIN_SUCCESS':
    case 'FETCH_METRICS_REJECTION_REASONS_BY_DOMAIN_FAIL':
      return { ...state, reasonsLoading: false };

    case 'REFRESH_REJECTION_BY_DOMAIN_TABLE':
      return { ...state, list: payload.reasons };

    default:
      return state;
  }
};
