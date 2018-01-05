const initialState = {
  aggregatesLoading: false,
  aggregates: [],
  deliveriesLoading: false,
  deliveries: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_PENDING':
      return { ...state, aggregatesLoading: true };

    case 'FETCH_METRICS_SUCCESS':
    case 'FETCH_METRICS_FAIL':
      return { ...state, aggregatesLoading: false };

    case 'FETCH_METRICS_DELIVERIES_BY_ATTEMPT_PENDING':
      return { ...state, deliveriesLoading: true };

    case 'FETCH_METRICS_DELIVERIES_BY_ATTEMPT_SUCCESS':
    case 'FETCH_METRICS_DELIVERIES_BY_ATTEMPT_FAIL':
      return { ...state, deliveriesLoading: false };

    case 'REFRESH_ACCEPTED_CHART':
      return { ...state, ...payload };

    default:
      return state;
  }
};
