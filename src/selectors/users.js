import _ from 'lodash';
import { createSelector } from 'reselect';

const getUsers = (state) => state.users.entities;
const getUserId = (state, id) => id;
const isCurrentUser = ({ currentUser }) => (user) => user.username === currentUser.username;

// Get, reduce, enrich, and sort list of users
export const selectUsers = createSelector(
  [getUsers, isCurrentUser],
  (users, isCurrentUser) => {
    const userList = Object.values(users);
    const enrichedUserList = userList.map((user) => ({
      ...user,
      isCurrentUser: isCurrentUser(user)
    }));

    return _.sortBy(enrichedUserList, ({ name }) => name.toLowerCase());
  }
);

export const selectUserById = createSelector(
  [getUsers, getUserId, isCurrentUser],
  (users, id, isCurrentUser) => {
    const user = users[id];

    if (!user) {
      return;
    }

    return ({
      ...user,
      isCurrentUser: isCurrentUser(user)
    });
  }
);
