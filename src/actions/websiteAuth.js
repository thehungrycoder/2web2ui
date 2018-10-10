import { sparkpostLogin, useRefreshToken } from '../helpers/http';
import siteCookie from '../helpers/websiteAuthCookie';
import config from 'src/config';
const { authentication } = config;
const { site: siteCfg } = authentication;

function successAction({ data = {}}) {
  return {
    type: 'WEBSITE_AUTH_SUCCESS',
    payload: data
  };
}

function errorAction(err) {
  const { response = {}} = err;
  const { data = {}} = response;
  const { error_description: errorDescription } = data;
  return {
    type: 'WEBSITE_AUTH_FAIL',
    payload: {
      errorDescription
    }
  };
}

function handleAuthResponse(apiCall, dispatch) {
  return apiCall.then((result) => { dispatch(successAction(result)); })
    .catch((err) => { dispatch(errorAction(err)); });
}

export function authenticate(username, password, rememberMe = false) {
  return (dispatch) => handleAuthResponse(
    sparkpostLogin(username, password, rememberMe, siteCfg.authHeader),
    dispatch);
}

export function login(saveCookie) {
  return (dispatch, getState) => {
    if (saveCookie) {
      siteCookie.save(getState().websiteAuth);
    }
    dispatch({
      type: 'WEBSITE_AUTH_COMPLETE'
    });
  };
}

export function refresh() {
  return (dispatch, getState) => {
    const { websiteAuth: { refreshToken }} = getState();
    return handleAuthResponse(
      useRefreshToken(refreshToken, siteCfg.authHeader),
      dispatch);
  };
}

export function logout() {
  siteCookie.remove();
  return {
    type: 'WEBSITE_AUTH_LOGOUT'
  };
}
