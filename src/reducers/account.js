export const initialState = {
  updateError: null,
  loading: false,
  subscription: {},
  updateLoading: false,
  createLoading: false
};

export default (state = initialState, { type, meta, payload }) => {
  switch (type) {
    case 'FETCH_ACCOUNT_PENDING': {
      return { ...state, loading: true };
    }

    case 'FETCH_ACCOUNT_SUCCESS': {
      return { ...state, loading: false, ...payload };
    }

    case 'FETCH_ACCOUNT_FAIL':
      return { ...state, loading: false };

    /**
     * FETCH_ACCOUNT_SUCCESS simply spreads the payload into state,
     * so it's impossible to remove keys from the account -- this is
     * the main place we want to do that and it's usually just for testing
     */
    case 'REMOVE_ACCOUNT_BILLING': {
      const updated = { ...state, loading: false, ...payload };
      delete updated.billing;
      return updated;
    }

    case 'UPDATE_ACCOUNT_PENDING':
      return { ...state, updateLoading: true, updateError: null };

    case 'UPDATE_ACCOUNT_SUCCESS':
      return { ...state, updateLoading: false, ...meta.data };

    case 'UPDATE_ACCOUNT_FAIL':
      return { ...state, updateError: payload, updateLoading: false };

    case 'CREATE_ACCOUNT_PENDING':
      return { ...state, createLoading: true, createError: null };

    case 'CREATE_ACCOUNT_SUCCESS':
      return { ...state, createLoading: false, payload };

    case 'CREATE_ACCOUNT_FAIL':
      return { ...state, createError: payload, createLoading: false };

    default:
      return state;
  }
};
