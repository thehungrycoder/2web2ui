import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import { showAlert } from './globalAlert';

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
    .catch(({ message }) => dispatch(showAlert({ type: 'error', message })));
}

export default {
  listUsers,
  updateUser
};
