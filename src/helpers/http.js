import config from '../config';

import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';

const { authentication } = config;

const buildHeaders = (authHeader) => ({
  Authorization: authHeader,
  'Content-Type': 'application/x-www-form-urlencoded'
});

// TODO handle timeout error better

function useRefreshToken(refreshToken, authHeader = authentication.app.authHeader) {
  return sparkpostRequest({
    method: 'POST',
    url: '/v1/authenticate',
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    headers: buildHeaders(authHeader)
  });
}

function sparkpostLogin(username, password, rememberMe, authHeader = authentication.app.authHeader) {
  username = encodeURIComponent(username);
  password = encodeURIComponent(password);
  const data = `grant_type=password&username=${username}&password=${password}&rememberMe=${rememberMe}`;

  return sparkpostRequest({
    method: 'POST',
    url: '/v1/authenticate',
    data,
    headers: buildHeaders(authHeader)
  });
}

export { sparkpostRequest, sparkpostLogin, useRefreshToken };
