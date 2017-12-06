const initialState = {
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

    case 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN_PENDING':
      return { ...state, reasonsLoading: true };

    case 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN_SUCCESS':
    case 'FETCH_METRICS_BOUNCE_REASONS_BY_DOMAIN_FAIL':
      return { ...state, reasonsLoading: false };

    case 'REFRESH_BOUNCE_CHART':
      return { ...state, ...payload };

    case 'REFRESH_BOUNCE_TABLE':
      return { ...state, ...payload };

    default:
      return state;
  }
};
