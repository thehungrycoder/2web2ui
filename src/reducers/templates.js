const initialState = { list: null, listError: null };

export default (state = initialState, action) => {
  switch (action.type) {
    // List
    case 'LIST_TEMPLATES_PENDING':
      return { ...state, listLoading: true, listError: null };

    case 'LIST_TEMPLATES_SUCCESS':
      return { ...state, list: action.payload, listLoading: false };

    case 'LIST_TEMPLATES_FAIL':
      return { ...state, listError: action.payload, listLoading: false };

    // Get Draft
    case 'GET_DRAFT_TEMPLATE_PENDING':
      return { ...state, getLoading: true };

    case 'GET_DRAFT_TEMPLATE_SUCCESS':
      return { ...state, draft: action.payload, getLoading: false };

    case 'GET_DRAFT_TEMPLATE_FAIL':
      return { ...state, getLoading: false };

    // Get Published
    case 'GET_PUBLISHED_TEMPLATE_PENDING':
      return { ...state, getLoading: true };

    case 'GET_PUBLISHED_TEMPLATE_SUCCESS':
      return { ...state, published: action.payload, getLoading: false };

    case 'GET_PUBLISHED_TEMPLATE_FAIL':
      return { ...state, getLoading: false };

    case 'CLEAR_TEMPLATE':
      return { ...state, draft: null, published: null };

    default:
      return state;
  }
};
