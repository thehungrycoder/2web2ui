const initialState = {
  list: [],
  abTest: {},
  getLoading: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    /* LIST */

    case 'LIST_AB_TESTS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_AB_TESTS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    case 'LIST_AB_TESTS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    default:
      return state;
  }
};
