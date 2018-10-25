import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import { login } from 'src/actions/auth';

export function getTfaStatusBeforeLoggedIn({ username, token }) {
  return sparkpostRequest({
    method: 'GET',
    url: `/v1/users/${username}/two-factor`,
    headers: {
      Authorization: token
    }
  });
}

export function getTfaStatus() {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    return dispatch(sparkpostApiRequest({
      type: 'GET_TFA_STATUS',
      meta: {
        method: 'GET',
        url: `/v1/users/${currentUser.username}/two-factor`
      }
    }));
  };
}

export function getTfaBackupStatus() {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    return dispatch(sparkpostApiRequest({
      type: 'GET_TFA_BACKUP_STATUS',
      meta: {
        method: 'GET',
        url: `/v1/users/${currentUser.username}/two-factor/backup`
      }
    }));
  };
}

export function generateBackupCodes(password) {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    return dispatch(sparkpostApiRequest({
      type: 'TFA_GENERATE_BACKUP_CODES',
      meta: {
        method: 'POST',
        url: `/v1/users/${currentUser.username}/two-factor/backup`,
        data: {
          password
        }
      }
    }));
  };
}

export function clearBackupCodes() {
  return {
    type: 'TFA_CLEAR_BACKUP_CODES'
  };
}

export function getTfaSecret() {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    return dispatch(sparkpostApiRequest({
      type: 'GET_TFA_SECRET',
      meta: {
        method: 'PUT',
        url: `/v1/users/${currentUser.username}/two-factor`,
        data: {
          enabled: true
        }
      }
    }));
  };
}

/**
 * Enables or disables TFA
 *
 * @param {*} data - request data
 * @param {Boolean} data.enabled - true or false to enable/disable
 * @param {Number} data.code - tfa generated code, required to enable
 * @param {String} data.password - user password, required to disable
 */
export function toggleTfa(data) {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    return dispatch(sparkpostApiRequest({
      type: 'TFA_TOGGLE',
      meta: {
        method: 'PUT',
        url: `/v1/users/${currentUser.username}/two-factor`,
        data
      }
    })).catch(() => {
      // swallow error, handled in reducer
    });
  };
}

export function verifyAndLogin({ authData, code }) {
  return (dispatch) => {
    dispatch({ type: 'TFA_VERIFICATION_PENDING' });

    return sparkpostRequest({
      method: 'POST',
      url: `/v1/users/${authData.username}/two-factor`,
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

        throw err;
      });
  };
}
