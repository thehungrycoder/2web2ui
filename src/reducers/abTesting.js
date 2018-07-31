const initialState = {
  list: [],
  abTest: {},
  listLoading: true,
  listError: null,
  createError: null
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

    /* CREATE DRAFT */

    case 'CREATE_AB_TEST_DRAFT_PENDING':
      return { ...state, abTest: {}, createError: null };

    case 'CREATE_AB_TEST_DRAFT_SUCCESS':
      return { ...state, abTest: { id: action.payload.id }};

    case 'CREATE_AB_TEST_DRAFT_FAIL':
      return { ...state, abTest: {}, createError: action.payload };

    default:
      return state;
  }
};
