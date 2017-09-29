const initialState = {
  entities: [],
  error: null,
  loading: false,
  sortKey: 'name'
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LIST_USERS_FAIL':
      return { ...initialState, error: action.payload };
    case 'LIST_USERS_PENDING':
      return { ...initialState, loading: true };
    case 'LIST_USERS_SUCCESS':
      return { ...initialState, entities: action.payload };

    default:
      return state;
  }
};
