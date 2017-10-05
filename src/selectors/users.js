import fp from 'lodash/fp';
import { createSelector } from 'reselect';

const getCurrentUser = (state) => state.currentUser;
const getUsers = (state) => state.users.entities;

// Get, reduce, enrich, and sort list of users
export const selectUsers = createSelector(
  [getCurrentUser, getUsers],
  (currentUser, users) => fp.flow(
    fp.values,
    fp.map((user) => ({ ...user, isCurrentUser: currentUser.username === user.username })),
    fp.sortBy(({ name }) => name.toLowerCase()) // downcase to match current UI
  )(users)
);
