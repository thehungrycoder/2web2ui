/**
 * Intercepts SPARKPOST_API_REQUEST actions and
 * creates the appropriate HTTP request, dispatching
 * the 3 necessary actions for each request.
 */

import _ from 'lodash';
import { refresh, logout } from '../actions/auth';
import { received } from '../actions/apiFailure';
import { sparkpostRequest, useRefreshToken } from '../helpers/http';
import { resolveOnCondition } from '../helpers/promise';

const maxRefreshRetries = 3;
let refreshing = false;
const refreshTokensUsed = new Set();

export default function sparkpostApiRequest({ dispatch, getState }) {
  return (next) => (action) => {
    next(action);

    if (action.type !== 'SPARKPOST_API_REQUEST') {
      return;
    }

    const { auth } = getState();
    const { meta } = action;
    const { url, method = 'get', type = 'NO_TYPE_DEFINED', params, headers, data, chain = {}, retries = 0 } = meta;
    const PENDING_TYPE = `${type}_PENDING`;
    const SUCCESS_TYPE = `${type}_SUCCESS`;
    const FAIL_TYPE = `${type}_FAIL`;

    dispatch({
      type: PENDING_TYPE,
      meta
    });

    const httpOptions = {
      method: method.toLowerCase(),
      url,
      params,
      headers,
      data
    };

    if (auth.loggedIn) {
      _.set(httpOptions, 'headers.Authorization', auth.token);
    }

    // if we are currently refreshing our token, wait for refresh
    // to complete and then re-dispatch the action so it uses new token
    if (refreshing) {
      return resolveOnCondition(() => !refreshing).then(() => {
        dispatch(action);
      }, _.noop);
    }

    return sparkpostRequest(httpOptions).then(({ data: { results }}) => {
      // we only get here if the request returned a 2xx status code
      dispatch({
        type: SUCCESS_TYPE,
        payload: results,
        meta
      });

      // if we need to chain together another action, do it here
      if (typeof chain.success === 'function') {
        chain.success({ dispatch, getState, results });
      }
    },
    // API request failed
    ({ message, response = {}}) => {
      // NOTE: if this is a 401 and we have a refresh token, we need to do a
      // refresh to get a new auth token and then re-dispatch this action
      if (response.status === 401 && auth.refreshToken && retries <= maxRefreshRetries) {
        action.meta.retries = retries + 1;

        // If we are currently refreshing the token OR if this refresh token
        // has already been used to refresh, we should re-dispatch the action
        // without trying to use the refresh token
        if (refreshing || refreshTokensUsed.has(auth.refreshToken)) {
          return resolveOnCondition(() => !refreshing).then(() => {
            dispatch(action);
          }, _.noop);
        }

        refreshing = true;
        refreshTokensUsed.add(auth.refreshToken);

        // call API for a new token
        return useRefreshToken(auth.refreshToken)

          // dispatch a refresh action to save new token results in cookie and store
          .then(({ data } = {}) => dispatch(refresh(data.access_token, data.refresh_token)))

          // dispatch the original action again, now that we have a new token ...
          // if anything in this refresh flow blew up, log out
          .then(
            // refresh token request succeeded
            () => {
              refreshing = false;
              dispatch(action);
            },
            // refresh token request failed
            () => dispatch(logout())
          );
      }

      // If we have a 403 or a 401 and we're not refreshing, log the user out silently
      if (response.status === 401 || response.status === 403) {
        return dispatch(logout());
      }

      // any other API error should automatically fail, to be handled in the reducers/components
      dispatch({
        type: FAIL_TYPE,
        payload: { message, response },
        meta
      });

      if (response.status >= 500) {
        dispatch(received({ message, response }, meta));
      }
    });
  };
}
