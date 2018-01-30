const initialState = {
  aggregateMetrics: {
    data: {},
    error: null,
    loading: false
  },
  linkMetrics: {
    data: [],
    error: null,
    loading: false
  }
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_ENGAGEMENT_AGGREGATE_METRICS_FAIL':
      return { ...state, aggregateMetrics: { data: [], error: payload, loading: false }};
    case 'GET_ENGAGEMENT_AGGREGATE_METRICS_PENDING':
      return {
        ...state,
        aggregateMetrics: { data: state.aggregateMetrics.data, error: null, loading: true }
      };
    case 'GET_ENGAGEMENT_AGGREGATE_METRICS_SUCCESS':
      return { ...state, aggregateMetrics: { data: payload[0], error: null, loading: false }};
    case 'GET_ENGAGEMENT_LINK_METRICS_FAIL':
      return { ...state, linkMetrics: { data: [], error: payload, loading: false }};
    case 'GET_ENGAGEMENT_LINK_METRICS_PENDING':
      return { ...state, linkMetrics: { data: state.linkMetrics.data, error: null, loading: true }};
    case 'GET_ENGAGEMENT_LINK_METRICS_SUCCESS':
      return { ...state, linkMetrics: { data: payload, error: null, loading: false }};
    default:
      return state;
  }
};
