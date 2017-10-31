const initialState = {
  loading: false,
  precision: '',
  categories: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_PENDING':
    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS':
      return { ...state, loading: true };

    case 'FETCH_METRICS_SUCCESS':
    case 'FETCH_METRICS_FAIL':
    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS_SUCCESS':
    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS_FAIL':
      return { ...state, loading: false };

    case 'REFRESH_BOUNCE_REPORT': {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
};
