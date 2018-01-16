import { createSelector } from 'reselect';

export const selectNumberOfUsers = ({ users }) => users.length;
export const selectNumberOfAccounts = ({ accounts }) => accounts.length;
export const selectTotalCost = ({ bills }) => bills.reduce((sum, bill) => sum + bill.total, 0);

export const selectSummary = createSelector(
  [
    selectNumberOfUsers,
    selectNumberOfAccounts,
    selectTotalCost
  ],
  (nUsers, nAccounts, totalBills) => ({
    nUsers,
    nAccounts,
    totalBills
  })
);
