const initialState = {
  keys: [],
  loadingKeys: false,
  error: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    case 'FETCH_API_KEYS_PENDING': {
      return { ...state, loadingKeys: true, error: null };
    }

    case 'FETCH_API_KEYS_SUCCESS': {
      return { ...state, loadingKeys: false, keys: payload };
    }

    case 'FETCH_API_KEYS_FAIL': {
      return { ...state, loadingKeys: false, error: payload };
    }

    default: {
      return state;
    }
  }
};
