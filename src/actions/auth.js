import { sparkpostLogin } from '../helpers/http';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as websiteAuth from 'src/actions/websiteAuth';
import { getTfaStatusBeforeLoggedIn } from 'src/actions/tfa';
import { showAlert } from 'src/actions/globalAlert';
import { removeHerokuToolbar } from 'src/helpers/heroku';
import authCookie from '../helpers/authCookie';
import { initializeAccessControl } from './accessControl';

/**
 * does the necessary actions to log a user in and set appropriate data in redux
 * store and auth cookie
 * Note: the login details are updated separately from setting "logged in"
 *
 * @param authData {Object} data used to update redux store and cookie
 * @param saveCookie {Boolean} saves session cookie
 *
 */
export function login({ authData = {}, saveCookie = false }) {
  if (saveCookie) { // save auth cookie
    authCookie.save(authData);
  }

  return (dispatch) => {
    dispatch(websiteAuth.login(saveCookie)); // Complete the website cookie set up process
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authData
    });
    dispatch(initializeAccessControl());
  };
}

/**
 * The login form flow
 * 1. see if you're logged in
 * 2. authenticate user
 * 3. check if 2FA is one, if so(set flag in redux store)
 * if not, update auth details in redux store, set cookie and update loggedIn
 * within redux store
 *
 */
export function authenticate(username, password, rememberMe = false) {
  // return a thunk
  return (dispatch, getState) => {
    const { loggedIn } = getState().auth;

    if (loggedIn) {
      return;
    }

    dispatch({ type: 'LOGIN_PENDING' });

    return sparkpostLogin(username, password, rememberMe)
      .then(({ data = {}} = {}) => {
        const authData = { ...data, username };

        // Start website auth token cookie setup process
        dispatch(websiteAuth.authenticate(username, password, rememberMe));

        return Promise.all([ authData, getTfaStatusBeforeLoggedIn({ username, token: authData.access_token })]);
      })
      .then(([ authData, tfaResponse]) => {
        // if tfa enabled must avoid logging in
        if (tfaResponse.data.results.enabled) {
          dispatch({
            type: 'TFA_ENABLED_ON_LOGIN',
            payload: authData
          });
        } else {
          dispatch(login({ authData, saveCookie: true }));
        }
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
  return (dispatch) => {
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

        // To match sparkpostApiRequest behavior
        dispatch(showAlert({ type: 'error', message: errorDescription }));

        throw err;
      });
  };
}

export function ssoCheck(username) {
  return sparkpostApiRequest({
    type: 'SSO_CHECK',
    meta: {
      method: 'GET',
      url: `/users/${username}/saml`,
      username
    }
  });
}

export function refresh(token, refreshToken) {
  return (dispatch) => {
    const newCookie = authCookie.merge({ access_token: token, refresh_token: refreshToken });
    dispatch(websiteAuth.refresh());
    return dispatch(login({ authData: newCookie }));
  };
}

export function logout() {
  return (dispatch, getState) => {
    const { auth } = getState();
    // only log out if currently logged in
    if (!auth.loggedIn) {
      return;
    }

    dispatch(websiteAuth.logout());

    removeHerokuToolbar();
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}
