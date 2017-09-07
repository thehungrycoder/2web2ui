const initialState = { list: [], listError: null };

export default (state = initialState, { type, payload }) => {
  switch (type) {

    case 'LIST_SUBACCOUNTS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_SUBACCOUNTS_SUCCESS':
      return { ...state, list: payload, listLoading: false };

    case 'LIST_SUBACCOUNTS_FAIL':
      return { ...state, listError: payload, listLoading: false };

    default:
      return state;
  }
};
