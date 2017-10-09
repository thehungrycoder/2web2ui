import { createSelector } from 'reselect';

const getAccount = (state) => state.account;
const getUser = (state) => state.currentUser;

export default createSelector(
  [getAccount, getUser],
  (account, currentUser) => ({ account, currentUser })
);

