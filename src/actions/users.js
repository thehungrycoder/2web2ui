import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export function listUsers() {
  return sparkpostApiRequest({
    type: 'LIST_USERS',
    meta: {
      method: 'GET',
      url: '/users'
    }
  });
}
