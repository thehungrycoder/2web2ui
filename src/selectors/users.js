import fp from 'lodash/fp';
import { createSelector } from 'reselect';

const getCurrentUser = (state) => state.currentUser;
const getUsers = (state) => state.users.entities;

const markCurrentUser = (currentUser) => fp.map((user) => ({ ...user, isCurrentUser: currentUser.username === user.username }));

// Get, reduce, enrich, and sort list of users
export const selectUsers = createSelector(
  [getCurrentUser, getUsers],
  (currentUser, users) => fp.flow(
    fp.values,
    markCurrentUser(currentUser),
    fp.sortBy(({ name }) => name.toLowerCase()) // downcase to match current UI
  )(users)
);
