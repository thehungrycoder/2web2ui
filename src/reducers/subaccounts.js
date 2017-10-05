const initialState = {
  list: [],
  listError: null,
  listLoaded: false,
  listLoading: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'LIST_SUBACCOUNTS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_SUBACCOUNTS_SUCCESS':
      return { ...state, listLoading: false, listLoaded: true, list: payload };

    case 'LIST_SUBACCOUNTS_FAIL':
      return { ...state, listLoading: false, listLoaded: true, listError: payload };

    default:
      return state;
  }
};
