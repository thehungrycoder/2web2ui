export default (state = {}, action) => {
  switch (action.type) {
    case 'FETCH_METRICS_PENDING':
      return { ...state, pending: true };

    case 'FETCH_METRICS_SUCCESS':
      return action.payload;

    case 'FETCH_METRICS_FAIL':
      return { error: action.payload };

    default:
      return state;
  }
};
