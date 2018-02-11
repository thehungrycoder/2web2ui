const initialState = {
  reasons: [],
  aggregates: {}
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_DELAY_REPORT_AGGREGATES_PENDING':
      return { ...state, aggregatesLoading: true };

    case 'GET_DELAY_REPORT_AGGREGATES_FAIL':
      return { ...state, aggregatesLoading: false };

    case 'GET_DELAY_REPORT_AGGREGATES_SUCCESS':
      return { ...state, aggregatesLoading: false, aggregates: payload[0] };

    case 'GET_DELAY_REPORT_REASONS_BY_DOMAIN_PENDING':
      return { ...state, reasonsLoading: true };

    case 'GET_DELAY_REPORT_REASONS_BY_DOMAIN_FAIL':
      return { ...state, reasonsLoading: false };

    case 'GET_DELAY_REPORT_REASONS_BY_DOMAIN_SUCCESS':
      return { ...state, reasonsLoading: false, reasons: payload };

    default:
      return state;
  }
};
