const initialState = {
  grants: [],
  grantsLoaded: false,
  grantsLoading: false,
  keys: [],
  keysLoaded: false,
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
      return { ...state, keysLoading: false, keysLoaded: true, keys: payload };
    }

    case 'LIST_API_KEYS_FAIL': {
      return { ...state, keysLoading: false, keysLoaded: true, error: payload };
    }

    // LIST_GRANTS
    case 'LIST_GRANTS_PENDING': {
      return { ...state, grantsLoading: true, error: null };
    }

    case 'LIST_GRANTS_SUCCESS': {
      return { ...state, grants: payload, grantsLoaded: true, grantsLoading: false };
    }

    case 'LIST_GRANTS_FAIL': {
      return { ...state, error: payload, grantsLoaded: true, grantsLoading: false };
    }

    case 'LIST_SUBACCOUNT_GRANTS_PENDING': {
      return { ...state, grantsLoading: true, error: null };
    }

    case 'LIST_SUBACCOUNT_GRANTS_SUCCESS': {
      return { ...state, subaccountGrants: payload, subaccountGrantsLoaded: true, subaccountGrantsLoading: false };
    }

    case 'LIST_SUBACCOUNT_GRANTS_FAIL': {
      return { ...state, error: payload, subaccountGrantsLoaded: true, subaccountGrantsLoading: false };
    }

    // CRUD
    case 'CREATE_API_KEY_SUCCESS':
      return { ...state, keysLoaded: false, newKey: payload.key };

    case 'DELETE_API_KEY_SUCCESS':
    case 'UPDATE_API_KEY_SUCCESS': {
      return { ...state, keysLoaded: false };
    }

    case 'HIDE_NEW_API_KEY': {
      return { ...state, newKey: null };
    }

    default: {
      return state;
    }
  }
};
