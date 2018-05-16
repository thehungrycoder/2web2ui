import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import authCookie from 'src/helpers/authCookie';
import _ from 'lodash';

export function get () {
  return (dispatch, getState) => {
    const { username } = getState().auth;
    return dispatch(sparkpostApiRequest({
      type: 'GET_CURRENT_USER',
      meta: {
        method: 'GET',
        url: `/users/${username}`
      }
    }));
  };
}

export function getGrantsFromCookie (authCookieData = authCookie.get()) {
  const { grants = []} = authCookieData;
  const expanded = grants.map((key) => ({ key }));
  return {
    type: 'GET_GRANTS_SUCCESS',
    payload: expanded
  };
}

export function getGrants ({ beta = false, role } = {}) {
  return (dispatch) => dispatch(sparkpostApiRequest({
    type: 'GET_GRANTS',
    meta: {
      url: '/authenticate/grants',
      params: { beta, role }
    }
  }))
    .then((grantData) => {
      const grants = grantData.map(({ key }) => key);
      authCookie.merge({ grants });
    });

}

export function verifyEmail (data = {}, { showErrorAlert = true, type = 'VERIFY_EMAIL' } = {}) {
  return (dispatch, getState) => {
    const { username } = getState().currentUser;
    return dispatch(sparkpostApiRequest({
      type,
      meta: {
        method: 'POST',
        url: `/users/${username}/verify`,
        data,
        showErrorAlert
      }
    }));
  };
}

export function verifyEmailToken (data) {
  return verifyEmail(data, { showErrorAlert: false, type: 'VERIFY_EMAIL_TOKEN' });
}

export function userGivesCookieConsent (username) {
  return (dispatch, getState) => {
    const state = getState();

    const { username } = state.currentUser;
    const action = {
      type: 'USER_GIVES_COOKIE_CONSENT',
      meta: {
        method: 'PUT',
        url: `/users/${username}`,
        data: { cookie_consent: true }
      }
    };
    return dispatch(sparkpostApiRequest(action)).then(() => dispatch(get()));
  };
}

export function updateUserUIOptions (updates) {
  return (dispatch, getState) => {
    const { currentUser } = getState();
    const existing = _.get(currentUser, 'options.ui', {});

    return dispatch(sparkpostApiRequest({
      type: 'UPDATE_USER_UI_OPTIONS',
      meta: {
        method: 'PUT',
        url: `/users/${currentUser.username}`,
        data: {
          options: {
            ui: { ...existing, ...updates }
          }
        }
      }
    }));
  };
}
