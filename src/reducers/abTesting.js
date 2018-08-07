const initialState = {
  list: [],
  listLoading: true,
  listError: null,
  createError: null,
  deletePending: false,
  cancelPending: false,
  detailsById: {},
  detailsLoading: false,
  detailsError: null
};

export default (state = initialState, { type, payload, meta }) => {
  switch (type) {
    /* LIST */

    case 'LIST_AB_TESTS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_AB_TESTS_FAIL':
      return { ...state, listError: payload, listLoading: false };

    case 'LIST_AB_TESTS_SUCCESS':
      return { ...state, list: payload, listLoading: false };

    /* CREATE DRAFT */

    case 'CREATE_AB_TEST_DRAFT_PENDING':
      return { ...state, createError: null };

    case 'CREATE_AB_TEST_DRAFT_SUCCESS':
      return { ...state };

    case 'CREATE_AB_TEST_DRAFT_FAIL':
      return { ...state, createError: payload };

    /* DELETE */

    case 'DELETE_AB_TEST_PENDING':
      return { ...state, deletePending: true };

    case 'DELETE_AB_TEST_SUCCESS':
      return {
        ...state,
        deletePending: false,
        list: state.list.filter((t) => (t.id !== meta.data.id && t.id !== meta.data.subaccountId))
      };

    case 'DELETE_AB_TEST_FAIL':
      return { ...state, deletePending: false };

    /* CANCEL */

    case 'CANCEL_AB_TEST_PENDING':
      return { ...state, cancelPending: true };

    case 'CANCEL_AB_TEST_SUCCESS':
      return { ...state, cancelPending: false };

    case 'CANCEL_AB_TEST_FAIL':
      return { ...state, cancelPending: false };

    /* Details */
    case 'GET_AB_TEST_PENDING':
      return { ...state, detailsLoading: true, detailsError: null };

    case 'GET_AB_TEST_FAIL':
      return { ...state, detailsError: payload, detailsLoading: false };

    case 'GET_AB_TEST_SUCCESS':
      return {
        ...state,
        detailsLoading: false,
        detailsById: {
          ...state.detailsById,
          [payload.id]: {
            ...state.detailsById[payload.id],
            [`version_${payload.version}`]: payload
          }
        }
      };

    /* Get Latest */
    case 'GET_LATEST_AB_TEST_SUCCESS':
      return {
        ...state,
        detailsById: {
          ...state.detailsById,
          [payload.id]: {
            ...state.detailsById[payload.id],
            latest: payload.version
          }
        }
      };

    default:
      return state;
  }
};
