import { sparkpostLogin } from '../helpers/http';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

import authCookie from '../helpers/authCookie';
import { initializeAccessControl } from './accessControl';


export function login(authData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authData
    });

    dispatch(initializeAccessControl());
  };
}

export function authenticate(username, password, rememberMe = false) {
  // return a thunk
  return (dispatch, getState) => {
    const { loggedIn } = getState().auth;

    if (loggedIn) {
      return;
    }

    dispatch({ type: 'LOGIN_PENDING' });

    sparkpostLogin(username, password, rememberMe)
      .then(({ data = {}} = {}) => {
        const payload = { ...data, username };

        // save auth cookie
        authCookie.save(payload);

        // dispatch login success event
        dispatch(login(payload));
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription } = data;

        // TODO: handle a timeout error better

        dispatch({
          type: 'LOGIN_FAIL',
          payload: {
            errorDescription
          }
        });
      });
  };
}

export function confirmPassword(username, password) {
  return (dispatch, getState) => {
    dispatch({ type: 'CONFIRM_PASSWORD' });

    return sparkpostLogin(username, password, false)
      .then(({ data = {}} = {}) => {
        const payload = { ...data, username };

        // dispatch login success event
        dispatch({
          type: 'CONFIRM_PASSWORD_SUCCESS',
          payload
        });
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription } = data;
        dispatch({
          type: 'CONFIRM_PASSWORD_FAIL',
          payload: {
            errorDescription
          }
        });
        throw err;
      });
  };
}

export function ssoCheck(username) {
  return (dispatch, getState) => {
    dispatch({ type: 'SSO_CHECK' });

    return sparkpostRequest({
      method: 'GET',
      url: `/users/${username}/saml`
      // url: 'https://d79ace26-eeea-4129-8811-f51a31449321.mock.pstmn.io/api/v1/users/ddd/saml'
    })
    .then((payload) => {
      dispatch({ type: 'SSO_CHECK_SUCCESS', payload: payload.data });
    })
    .catch((err) => {
      let errorDescription = null;

      try {
        errorDescription = err.response.data.errors[0].message;
      } catch (e) {
        errorDescription = err.message;
      }

      dispatch({
        type: 'SSO_CHECK_FAIL',
        payload: { errorDescription }
      });
    });
  };
}

export function refresh(token, refreshToken) {
  const newCookie = authCookie.merge({ access_token: token, refresh_token: refreshToken });
  return login(newCookie);
}

export function logout() {
  return (dispatch) => {
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}
