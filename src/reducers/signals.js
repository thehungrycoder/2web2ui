const initialDimension = {
  overview: {},
  details: {
    facet: '',
    loading: false,
    empty: false,
    error: null,
    data: []
  }
};

const initialState = {
  spamTraps: initialDimension,
  healthScore: initialDimension,
  engagement: initialDimension
};

export default (state = initialState, { type, payload, meta }) => {
  const setDimensionPageState = (dimension, page, data) => ({
    ...state,
    [dimension]: {
      ...state[dimension],
      [page]: {
        ...state[dimension][page],
        ...data
      }
    }
  });

  switch (type) {
    case 'GET_SIGNALS_SPAM_TRAPS_DETAILS_PENDING':
      return setDimensionPageState('spamTraps', 'details', {
        loading: true,
        empty: false,
        error: false,
        data: []
      });

    case 'GET_SIGNALS_SPAM_TRAPS_DETAILS_FAIL':
      return setDimensionPageState('spamTraps', 'details', {
        loading: false,
        error: payload.error
      });

    case 'GET_SIGNALS_SPAM_TRAPS_DETAILS_SUCCESS':
      return setDimensionPageState('spamTraps', 'details', {
        loading: false,
        data: payload.data, // TODO match facet id from meta
        empty: payload.data.length === 0
      });

    default:
      return state;
  }
};
