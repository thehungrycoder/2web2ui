const initialState = {
  list: [],
  loading: false,
  error: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case 'FETCH_API_KEYS_PENDING': {
      return { ...state, loading: true, error: null };
    }

    case 'FETCH_API_KEYS_SUCCESS': {
      return { ...state, list: payload, loading: false };
    }

    case 'FETCH_API_KEYS_FAIL': {
      return { ...state, error: payload, loading: false };
    }

    default: {
      return state;
    }
  }
};
