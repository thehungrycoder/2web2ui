import { createSelector } from 'reselect';

const getAccountSupport = (state) => state.account.support;

const entitledToSupport = createSelector(
  [getAccountSupport],
  (support) => support && support.online
);

export default entitledToSupport;
