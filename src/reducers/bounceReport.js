const initialState = {
  loading: false,
  precision: '',
  categories: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'FETCH_METRICS_PENDING':
      return { ...state, aggregatesLoading: true };

    case 'FETCH_METRICS_SUCCESS':
    case 'FETCH_METRICS_FAIL':
      return { ...state, aggregatesLoading: false };

    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS_PENDING':
      return { ...state, categoriesLoading: true };

    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS_SUCCESS':
    case 'FETCH_METRICS_BOUNCE_CLASSIFICATIONS_FAIL':
      return { ...state, categoriesLoading: false };

    case 'REFRESH_BOUNCE_REPORT': {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
};
