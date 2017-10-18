const initialState = {
  list: [],
  error: null,
  listLoaded: false,
  listLoading: false
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    case 'LIST_RECIPIENT_LISTS_PENDING':
      return { ...state, listLoading: true, error: null };

    case 'LIST_RECIPIENT_LISTS_SUCCESS':
      return { ...state, listLoading: false, listLoaded: true, list: payload };

    case 'LIST_RECIPIENT_LISTS_FAIL':
      return { ...state, listLoading: false, listLoaded: true, error: { payload, meta }};

    default:
      return state;
  }
};
