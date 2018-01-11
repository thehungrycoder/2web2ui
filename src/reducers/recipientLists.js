const initialState = {
  list: [],
  currentId: null,
  error: null,
  listLoaded: false,
  listLoading: false
};

export default (state = initialState, { type, id, payload, meta }) => {
  switch (type) {
    case 'LIST_RECIPIENT_LISTS_PENDING':
      return { ...state, listLoading: true, error: null };

    case 'LIST_RECIPIENT_LISTS_SUCCESS':
      return { ...state, listLoading: false, listLoaded: true, list: payload };

    case 'LIST_RECIPIENT_LISTS_FAIL':
      return { ...state, listLoading: false, listLoaded: true, error: { payload, meta }};

    case 'CREATE_RECIPIENT_LIST_PENDING':
      return { ...state, loading: true };

    case 'CREATE_RECIPIENT_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        list: [ ...state.list, {
          id: payload.id,
          name: payload.name,
          total_accepted_recipients: payload.total_accepted_recipients,
          description: meta.data.description
        }]
      };

    case 'CREATE_RECIPIENT_LIST_FAIL':
      return { ...state, loading: false };

    case 'SET_CURRENT_RECIPIENT_LIST':
      return { ...state, currentId: id };

    case 'UPDATE_RECIPIENT_LIST_SUCCESS':
      return {
        ...state,
        list: state.list.map((item) =>
          item.id === payload.id ? { ...item, ...payload } : item)
      };

    case 'DELETE_RECIPIENT_LIST_SUCCESS':
      return {
        ...state,
        list: state.list.filter((item) => item.id !== meta.id)
      };

    default:
      return state;
  }
};
