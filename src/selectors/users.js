import fp from 'lodash/fp';

// Get, reduce, enrich, and sort list of users
export const selectUsers = ({ currentUser, users }) => fp.flow(
  fp.values,
  fp.map((user) => ({ ...user, isCurrentUser: currentUser.username === user.username })),
  fp.sortBy(({ name }) => name.toLowerCase()) // downcase to match current UI
)(users.entities);
