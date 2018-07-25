const initialState = {
  list: [],
  listLoading: true,
  listError: null,
  createError: null,
  detailsById: {},
  detailsLoading: false,
  detailsError: null
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
      return { ...state, createError: null };

    case 'CREATE_AB_TEST_DRAFT_SUCCESS':
      return { ...state };

    case 'CREATE_AB_TEST_DRAFT_FAIL':
      return { ...state, createError: action.payload };

    /* Details */
    case 'GET_AB_TEST_PENDING':
      return { ...state, detailsLoading: true, detailsError: null };

    case 'GET_AB_TEST_FAIL':
      return { ...state, detailsError: action.payload, detailsLoading: false };

    case 'GET_AB_TEST_SUCCESS':
      return {
        ...state,
        detailsLoading: false,
        detailsById: {
          ...state.detailsById,
          [action.payload.id]: {
            ...state.detailsById[action.payload.id],
            [`version_${action.payload.version}`]: action.payload
          }
        }
      };

    default:
      return state;
  }
};
