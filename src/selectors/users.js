import fp from 'lodash/fp';

// Get, enrich, and sort list of users
export function selectUsers({ currentUser, users }) {
  return fp.flow(
    fp.map((user) => ({ ...user, isCurrentUser: currentUser.username === user.username })),
    fp.sortBy(users.sortKey)
  )(users.entities);
}
