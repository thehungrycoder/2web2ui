const initialState = {
  grants: [],
  grantsLoading: false,
  subaccountGrants: [],
  subaccountGrantsLoading: false,
  keys: [],
  keysLoading: false,
  error: null,
  newKey: null
};

export default (state = initialState, { payload, type }) => {
  switch (type) {
    // LIST_API_KEYS
    case 'LIST_API_KEYS_PENDING': {
      return { ...state, keysLoading: true, error: null };
    }

    case 'LIST_API_KEYS_SUCCESS': {
      return { ...state, keysLoading: false, keys: payload };
    }

    case 'LIST_API_KEYS_FAIL': {
      return { ...state, keysLoading: false, error: payload };
    }

    // LIST_GRANTS
    case 'LIST_GRANTS_PENDING': {
      return { ...state, grantsLoading: true, error: null };
    }

    case 'LIST_GRANTS_SUCCESS': {
      return { ...state, grants: payload, grantsLoading: false };
    }

    case 'LIST_GRANTS_FAIL': {
      return { ...state, error: payload, grantsLoading: false };
    }

    case 'LIST_SUBACCOUNT_GRANTS_PENDING': {
      return { ...state, subaccountGrantsLoading: true, error: null };
    }

    case 'LIST_SUBACCOUNT_GRANTS_SUCCESS': {
      return { ...state, subaccountGrants: payload, subaccountGrantsLoading: false };
    }

    case 'LIST_SUBACCOUNT_GRANTS_FAIL': {
      return { ...state, error: payload, subaccountGrantsLoading: false };
    }

    // CRUD
    case 'CREATE_API_KEY_SUCCESS': {
      return { ...state, newKey: payload.key };
    }

    case 'DELETE_API_KEY_SUCCESS':
    case 'UPDATE_API_KEY_SUCCESS': {
      return { ...state };
    }

    case 'HIDE_NEW_API_KEY': {
      return { ...state, newKey: null };
    }

    default: {
      return state;
    }
  }
};
