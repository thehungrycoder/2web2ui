const initialState = { list: null, hasSuppressions: false, listLoading: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_SUPPRESSIONS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'CHECK_SUPPRESSIONS_SUCCESS':
      return { ...state, hasSuppression: Boolean((action.payload || []).length), listLoading: false };

    case 'CHECK_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    //recipients search
    case 'SEARCH_SUPPRESSIONS_RECIPIENT_PENDING':
      return { ...state, loading: true };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_SUCCESS':
      return { ...state, loading: false, resultsSet: action.payload };

    case 'SEARCH_SUPPRESSIONS_RECIPIENT_FAIL': {
      return { ...state, loading: false };
    }

    default:
      return state;
  }
};
