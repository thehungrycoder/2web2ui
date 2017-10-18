const initialState = {
  list: [],
  error: null,
  listLoaded: false,
  listLoading: false
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_TRACKING_DOMAINS_PENDING':
      return { ...state, listLoading: true, error: null };

    case 'LIST_TRACKING_DOMAINS_SUCCESS':
      return { ...state, listLoading: false, listLoaded: true, list: payload };

    case 'LIST_TRACKING_DOMAINS_FAIL':
      return { ...state, listLoading: false, listLoaded: true, error: { payload, meta, resource: 'tracking domains' }};

    default:
      return state;
  }
};
