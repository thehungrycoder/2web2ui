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
    case 'CREATE_RECIPIENT_VERIFICATION_LIST_PENDING':
      return { ...state, loading: true };

    case 'CREATE_RECIPIENT_VERIFICATION_LIST_SUCCESS':
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

    case 'CREATE_RECIPIENT_VERIFICATION_LIST_FAIL':
      return { ...state, loading: false };

    default:
      return state;
  }
};
