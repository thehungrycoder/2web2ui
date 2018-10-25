import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

export function sendPasswordResetEmail({ user }) {
  const data = {};

  if (user.indexOf('@') === -1) {
    data.username = user;
  } else {
    data.email = user;
  }

  return (dispatch) => {
    dispatch({ type: 'SEND_PASSWORD_EMAIL_PENDING' });

    return sparkpostRequest({
      method: 'POST',
      url: '/v1/users/password/forgot',
      data
    })
      .then(() => dispatch({ type: 'SEND_PASSWORD_EMAIL_SUCCESS' }))
      .catch((err) => dispatch({
        type: 'SEND_PASSWORD_EMAIL_ERROR',
        payload: err
      }));
  };
}

export function resetPassword({ password, token }) {
  return (dispatch) => {
    dispatch({ type: 'RESET_PASSWORD_PENDING' });

    return sparkpostRequest({
      method: 'POST',
      url: '/v1/users/password/reset',
      headers: { Authorization: token },
      data: { password }
    })
      .then(() => dispatch({ type: 'RESET_PASSWORD_SUCCESS' }))
      .catch((err) => dispatch({
        type: 'RESET_PASSWORD_ERROR',
        payload: err
      }));
  };
}
