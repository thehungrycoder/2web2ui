import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { showAlert } from './globalAlert';

export function deleteUser(username) {
  const action = {
    type: 'DELETE_USER',
    meta: {
      data: { username }, // need in reducer, no user reference in response
      method: 'DELETE',
      url: `/users/${username}`
    }
  };

  return (dispatch) => dispatch(sparkpostApiRequest(action))
    .then(() => dispatch(showAlert({
      type: 'success',
      message: `Successfully deleted ${username}`
    })))
    .catch(() => dispatch(showAlert({
      type: 'error',
      message: `Unable to delete ${username}.`
    })));
}

export function listUsers() {
  return sparkpostApiRequest({
    type: 'LIST_USERS',
    meta: {
      method: 'GET',
      url: '/users'
    }
  });
}

export function updateUser(username, data) {
  const action = {
    type: 'UPDATE_USER',
    meta: {
      method: 'PUT',
      url: `/users/${username}`,
      data: {
        ...data,
        username // need in reducer, no user reference in response
      }
    }
  };

  return (dispatch) => dispatch(sparkpostApiRequest(action))
    .then(({ message }) => dispatch(showAlert({ type: 'success', message })))
    .catch(() => dispatch(showAlert({
      type: 'error',
      message: `Unable to update role for ${username}.`
    })));
}
