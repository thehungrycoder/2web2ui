const initialState = {
  grants: [],
  verifyingEmail: null,
  emailError: null,
  verifyingToken: null,
  tokenError: null
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
      return { ...state, verifyingEmail: true, emailError: null };

    case 'VERIFY_EMAIL_SUCCESS':
      return { ...state, verifyingEmail: false };

    case 'VERIFY_EMAIL_FAIL':
      return { ...state, emailError: payload, verifyingEmail: false };

    case 'VERIFY_EMAIL_TOKEN_PENDING':
      return { ...state, verifyingToken: true, tokenError: null };

    case 'VERIFY_EMAIL_TOKEN_SUCCESS':
      return { ...state, email_verified: true, verifyingToken: false };

    case 'VERIFY_EMAIL_TOKEN_FAIL':
      return { ...state, tokenError: payload, verifyingToken: false };

    default:
      return state;
  }
};
