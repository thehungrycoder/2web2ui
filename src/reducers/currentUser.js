const initialState = {
  grants: [],
  verifying: null,
  verifyError: null
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_CURRENT_USER_SUCCESS':
      return { ...state, ...payload };

    case 'GET_GRANTS_SUCCESS':
      return { ...state, grants: payload };

    case 'CREATE_SUBACCOUNT_SUCCESS':
      return { ...state, has_subaccounts: true };

    case 'VERIFY_EMAIL_PENDING':
      return { ...state, verifying: true, verifyError: null };

    case 'VERIFY_EMAIL_SUCCESS': {
      return { ...state, verifying: false };
    }

    case 'VERIFY_EMAIL_FAIL': {
      return { ...state, verifyError: payload, verifying: false };
    }

    case 'VERIFY_EMAIL_TOKEN_PENDING':
      return { ...state, verifying: true, verifyError: null };

    case 'VERIFY_EMAIL_TOKEN_SUCCESS': {
      return { ...state, email_verified: true, verifying: false };
    }

    case 'VERIFY_EMAIL_TOKEN_FAIL': {
      return { ...state, verifyError: payload, verifying: false };
    }

    default:
      return state;
  }
};
