import { sparkpostLogin } from '../helpers/http';
import authCookie from '../helpers/authCookie';
import { fetch as fetchAccount } from './account';
import { fetch as fetchCurrentUser } from './currentUser';

export function login(authData) {
  return (dispatch) => {
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: authData
    });
    
    // initialize some state
    dispatch(fetchAccount({ includeBilling: true }));
    dispatch(fetchCurrentUser());
  }
}

export function authenticate(username, password, remember_me = false) {
  // return a thunk
  return (dispatch, getState) => {
    const { loggedIn } = getState().auth;
        
    if (loggedIn) {
      return;
    }
            
    dispatch({ type: 'LOGIN_PENDING' });
    
    sparkpostLogin(username, password, remember_me)
      .then(({ data = {} } = {}) => {
        const payload = { ...data, username };
        
        // save auth cookie
        authCookie.save(payload);
        
        // dispatch login success event
        dispatch(login(payload));
      })
      .catch((err) => {
        const { response = {}} = err;
        const { data = {}} = response;
        const { error_description: errorDescription = 'An unknown error occurred' } = data;
        
        // TODO: handle a timeout error better
        
        dispatch({
          type: 'LOGIN_FAIL',
          payload: {
            errorDescription
          }
        });
      });
    
  }
}

export function refresh(token, refreshToken) {
  let oldCookie = authCookie.get();
  if (oldCookie) {
    oldCookie = JSON.parse(oldCookie);
  }
  const newCookie = Object.assign({}, oldCookie, { token, refreshToken });
  authCookie.save(newCookie);
  return {
    type: 'AUTH_LOG_IN',
    payload: newCookie
  };
}

export function logout() {
  return (dispatch) => {
    authCookie.remove();
    dispatch({
      type: 'LOGOUT'
    });
  };
}