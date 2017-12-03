const initialState = { list: [], listLoading: true };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SUPPRESSIONS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'GET_SUPPRESSIONS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'GET_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    // search suppressions
    case 'SEARCH_SUPPRESSIONS_RECIPIENT_PENDING':
      return { ...state, loading: true };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_SUCCESS':
      return { ...state, loading: false, resultsSet: payload };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_FAIL': {
      return { ...state, loading: false };
    }

    default:
      return state;
  }
};
