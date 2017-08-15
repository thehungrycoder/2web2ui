import { sparkpostLogin } from '../helpers/http';
import authCookie from '../helpers/authCookie';
import { fetch as fetchAccount } from './account';
import { fetch as fetchCurrentUser } from './currentUser';

export function login (authData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authData
    });

    // initialize some state
    dispatch(fetchAccount({ include: 'usage,billing' }));
    dispatch(fetchCurrentUser());
  };
}

export function authenticate (username, password, rememberMe = false) {
  // return a thunk
  return (dispatch, getState) => {
    const { loggedIn } = getState().auth;

    if (loggedIn) {
      return;
    }

    dispatch({ type: 'LOGIN_PENDING' });

    sparkpostLogin(username, password, rememberMe)
      .then(({ data = {} } = {}) => {
        const payload = { ...data, username };

        // save auth cookie
        authCookie.save(payload);

        // dispatch login success event
        dispatch(login(payload));
      })
      .catch((err) => {
        const { response = {} } = err;
        const { data = {} } = response;
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

export function refresh (token, refreshToken) {
  let oldCookie = authCookie.get();
  const newCookie = Object.assign({}, oldCookie, { token, refreshToken });
  authCookie.save(newCookie);
  return login(newCookie);
}

export function logout () {
  return (dispatch) => {
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}
