import config from '../config';
import axios from 'axios';

const { apiBase, apiRequestTimeout, authentication } = config;

const sparkpostRequest = axios.create({
  baseURL: apiBase,
  timeout: apiRequestTimeout
});

// TODO handle timeout error better

const tokensUsed = [];
let refreshing = false;

function wait (condition, fn, ms = 500) {
  setTimeout(() => {
    if (condition) {
      return fn();
    }
    wait(condition, fn);
  }, ms);
}

function useRefreshToken (refreshToken) {
  if (tokensUsed.includes(refreshToken)) {
    return new Promise((resolve) => wait(refreshing, resolve));
  }

  tokensUsed.push(refreshToken);
  refreshing = true;

  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: authentication.headers
  })
  .then((results) => {
    refreshing = false;
    return results;
  })
  .catch((err) => {
    refreshing = false;
    throw err;
  });
}

function sparkpostLogin (username, password, rememberMe) {
  username = encodeURIComponent(username);
  password = encodeURIComponent(password);
  const data = `grant_type=password&username=${username}&password=${password}&rememberMe=${rememberMe}`;

  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data,
    headers: authentication.headers
  });
}

export { sparkpostRequest, sparkpostLogin, useRefreshToken };
