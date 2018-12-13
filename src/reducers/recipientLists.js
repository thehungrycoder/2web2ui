const initialState = {
  list: [],
  current: null,
  currentLoading: false,
  error: null,
  listLoaded: false,
  listLoading: false
};

export default (state = initialState, { meta, payload, type }) => {
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

    case 'GET_RECIPIENT_LIST_PENDING':
      return { ...state, currentLoading: true };

    case 'GET_RECIPIENT_LIST_FAIL':
      return { ...state, currentLoading: false };

    case 'GET_RECIPIENT_LIST_SUCCESS':
      return {
        ...state,
        currentLoading: false,
        current: payload
      };

    case 'VALIDATE_RECIPIENT_LIST_PENDING':
      return { ...state };

    case 'VALIDATE_RECIPIENT_LIST_FAIL':
      return { ...state };

    case 'VALIDATE_RECIPIENT_LIST_SUCCESS':
      localStorage.setItem('rl_id', meta.rl_id);
      localStorage.setItem('rv_id', payload.list_id);
      return { ...state, listValidatingPending: true };

    case 'FILTER_RECIPIENT_LIST_PENDING':
      return { ...state };

    case 'FILTER_RECIPIENT_LIST_FAIL':
      return { ...state };

    case 'FILTER_RECIPIENT_LIST_SUCCESS':
      localStorage.removeItem('rl_id');
      localStorage.removeItem('rv_id');
      return { ...state, listValidatingPending: true } ;



    default:
      return state;
  }
};
