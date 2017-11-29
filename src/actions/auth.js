import { sparkpostLogin } from '../helpers/http';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

import authCookie from '../helpers/authCookie';
import { initializeAccessControl } from './accessControl';


export function login(authData, saveCookie = false) {

  if (saveCookie) { // save auth cookie
    authCookie.save(authData);
  }

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

        // dispatch login success event
        login(payload, true);
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
  return sparkpostApiRequest({
    type: 'SSO_CHECK',
    meta: {
      method: 'GET',
      url: `/users/${username}/saml`
    }
  });
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
