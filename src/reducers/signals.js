const initialDimensionState = {
  data: [],
  error: null,
  loading: false,
  totalCount: 0
};

const initialState = {
  spamHits: initialDimensionState,
  healthScore: initialDimensionState,
  engagementRecency: initialDimensionState
};

const signalsReducer = (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'GET_SPAM_HITS_FAIL':
      return { ...state, spamHits: { ...initialDimensionState, error: payload.error, loading: false }};

    case 'GET_SPAM_HITS_PENDING':
      return { ...state, spamHits: { ...initialDimensionState, loading: true }};

    case 'GET_SPAM_HITS_SUCCESS': {
      const { data, total_count: totalCount } = payload;
      return { ...state, spamHits: { ...initialDimensionState, data, loading: false, totalCount }};
    }

    case 'GET_ENGAGEMENT_RECENCY_FAIL':
      return { ...state, engagementRecency: { ...initialDimensionState, error: payload.error, loading: false }};

    case 'GET_ENGAGEMENT_RECENCY_PENDING':
      return { ...state, engagementRecency: { ...initialDimensionState, loading: true }};

    case 'GET_ENGAGEMENT_RECENCY_SUCCESS': {
      const { data, total_count: totalCount } = payload;
      return { ...state, engagementRecency: { ...initialDimensionState, data, loading: false, totalCount }};
    }

    default:
      return state;
  }
};

export default signalsReducer;
