const initialState = {
  emailPending: false,
  emailError: null,
  emailSuccess: false,
  resetPending: false,
  resetError: null,
  resetSuccess: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SEND_PASSWORD_EMAIL_PENDING':
      return { ...state, emailPending: true, emailSuccess: false, emailError: null };

    case 'SEND_PASSWORD_EMAIL_SUCCESS':
      return { ...state, error: null, emailPending: false, emailSuccess: true };

    case 'SEND_PASSWORD_EMAIL_ERROR':
      return { ...state, emailPending: false, emailError: payload };

    case 'RESET_PASSWORD_PENDING':
      return { ...state, resetPending: true, resetSuccess: false };

    case 'RESET_PASSWORD_SUCCESS':
      return { ...state, error: null, resetPending: false, resetSuccess: true };

    case 'RESET_PASSWORD_ERROR':
      return { ...state, resetPending: false, resetError: payload };

    default:
      return state;
  }
};
