const initialState = { list: [], listLoading: true };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SUPPRESSIONS_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'GET_SUPPRESSIONS_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'GET_SUPPRESSIONS_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    default:
      return state;
  }
};
