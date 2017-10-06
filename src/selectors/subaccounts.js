import { createSelector } from 'reselect';

const getSubaccounts = ({ subaccounts }) => subaccounts.list;

export const hasSubaccounts = createSelector(
  getSubaccounts,
  (subaccounts) => !!subaccounts.length
);
