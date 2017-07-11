const initialState = { list: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_TEMPLATES_PENDING':
      return { ...state, listLoading: true };

    case 'LIST_TEMPLATES_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'LIST_TEMPLATES_FAIL':
      return { ...state, listLoading: false };
    default:
      return state;
  }
};
