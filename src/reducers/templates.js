const initialState = { list: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    // List
    case 'LIST_TEMPLATES_PENDING':
      return { ...state, listLoading: true };

    case 'LIST_TEMPLATES_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'LIST_TEMPLATES_FAIL':
      return { ...state, listLoading: false };

    // Get
    case 'GET_TEMPLATE_PENDING':
      return { ...state, getLoading: true };

    case 'GET_TEMPLATE_SUCCESS':
      return { ...state, activeTemplate: action.payload, getLoading: false };

    case 'GET_TEMPLATE_FAIL':
      return { ...state, getLoading: false };

    case 'RESET_TEMPLATE':
      return { ...state, activeTemplate: null };

    default:
      return state;
  }
};
