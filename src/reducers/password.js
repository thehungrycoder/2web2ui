const initialState = {
  emailPending: false,
  emailError: null,
  emailSuccess: false
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'SEND_PASSWORD_EMAIL_PENDING':
      return { ...state, emailPending: true, emailSuccess: false };

    case 'SEND_PASSWORD_EMAIL_SUCCESS':
      return { ...state, error: null, emailPending: false, emailSuccess: true };

    case 'SEND_PASSWORD_EMAIL_ERROR':
      return { ...state, emailPending: false, emailError: payload };

    default:
      return state;
  }
};
