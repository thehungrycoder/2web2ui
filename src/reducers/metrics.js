export default (state = { pending: false, error: null, results: []}, action) => {
  switch (action.type) {
    case 'FETCH_METRICS_PENDING':
      return { ...state, pending: true };

    case 'FETCH_METRICS_SUCCESS':
      return { ...state, error: null, pending: false, results: action.payload };

    case 'FETCH_METRICS_FAIL':
      return { ...state, pending: false, error: action.payload };

    default:
      return state;
  }
};
