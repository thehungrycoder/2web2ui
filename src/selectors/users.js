import _ from 'lodash';

// Get and sort list of users
export function selectUsers({ users }) {
  return _.sortBy(users.entities, users.sortKey);
}
