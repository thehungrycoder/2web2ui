const initialState = {
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ACCOUNT_PENDING': {
      return { ...state, loading: true };
    }

    case 'FETCH_ACCOUNT_SUCCESS':
      return { ...state, loading: false, ...action.payload };

    case 'FETCH_ACCOUNT_ERROR':
      return { ...state, loading: false };

    default:
      return state;
  }
};
