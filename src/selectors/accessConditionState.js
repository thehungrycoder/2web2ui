import { createSelector } from 'reselect';

const getAccount = (state) => state.account;
const getUser = (state) => state.currentUser;
const getACReady = (state) => state.accessControlReady;

export default createSelector(
  [getAccount, getUser, getACReady],
  (account, currentUser, ready) => ({ account, currentUser, ready })
);

