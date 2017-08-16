import config from '../config';
import axios from 'axios';
// import { resolveOnCondition } from './promise';

const { apiBase, apiRequestTimeout, authentication } = config;

const sparkpostRequest = axios.create({
  baseURL: apiBase,
  timeout: apiRequestTimeout
});

// TODO handle timeout error better

// const tokensUsed = [];
// let refreshing = false;

function useRefreshToken (refreshToken) {
  // If we are already mid-refresh for this token, return a promise
  // that will just resolve when we are done refreshing so that the
  // request can be retried with the new token without requesting
  // new auth tokens multiple times per refresh token
  // if (tokensUsed.includes(refreshToken)) {
  //   return resolveOnCondition(() => !refreshing);
  // }

  // tokensUsed.push(refreshToken);
  // refreshing = true;

  return sparkpostRequest({
    method: 'POST',
    url: '/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: authentication.headers
  });
  // .then((results) => {
  //   refreshing = false;
  //   return results;
  // })
  // .catch((err) => {
  //   refreshing = false;
  //   throw err;
  // });
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
