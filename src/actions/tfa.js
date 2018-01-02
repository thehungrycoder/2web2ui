import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';
import { login } from 'src/actions/auth';

export function get({ username, token }) {
  return sparkpostRequest({
    method: 'GET',
    url: `/users/${username}/two-factor`,
    headers: {
      Authorization: token
    }
  });
}

export function verifyAndLogin(code) {
  return (dispatch, getState) => {
    const authData = getState().auth;

    dispatch({ type: 'TFA_VERIFICATION_PENDING' });
    return sparkpostRequest({
      method: 'POST',
      url: `/users/${authData.username}/two-factor`,
      headers: {
        Authorization: authData.token
      },
      data: {
        code
      }})
      .then(() => {
        dispatch(login({
          authData: {
            access_token: authData.token,
            username: authData.username,
            refresh_token: authData.refreshToken
          },
          saveCookie: true
        }));

        dispatch({ type: 'TFA_VERIFICATION_SUCCESS' });
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription } = data;

        // TODO: handle a timeout error better
        dispatch({
          type: 'TFA_VERIFICATION_FAIL',
          payload: {
            errorDescription
          }
        });
      });
  };
}
