import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

export function sendPasswordResetEmail({ user }) {
  const data = {};

  if (user.indexOf('@') === -1) {
    data.username = user;
  } else {
    data.email = user;
  }

  return (dispatch) => {
    dispatch(emailPending());

    return sparkpostRequest({
      method: 'POST',
      url: '/users/password/forgot',
      data
    })
      .then(() => dispatch(emailSuccess()))
      .catch((err) => dispatch(emailError(err)));
  };
}

function emailPending() {
  return { type: 'SEND_PASSWORD_EMAIL_PENDING' };
}

function emailSuccess() {
  return { type: 'SEND_PASSWORD_EMAIL_SUCCESS' };
}

function emailError(error) {
  return {
    type: 'SEND_PASSWORD_EMAIL_ERROR',
    payload: error
  };
}

export function resetPassword({ password, token }) {
  return (dispatch) => {
    dispatch(resetPasswordPending());

    return sparkpostRequest({
      method: 'POST',
      url: '/users/password/reset',
      headers: { Authorization: token },
      data: { password }
    })
      .then(() => dispatch(resetPasswordSuccess()))
      .catch((err) => dispatch(resetPasswordError(err)));
  };
}

function resetPasswordPending() {
  return { type: 'RESET_PASSWORD_PENDING' };
}

function resetPasswordSuccess() {
  return { type: 'RESET_PASSWORD_SUCCESS' };
}

function resetPasswordError(error) {
  return {
    type: 'RESET_PASSWORD_ERROR',
    payload: error
  };
}
