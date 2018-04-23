import _ from 'lodash';
import { createSelector } from 'reselect';
import { currentPlanSelector } from './accountBillingInfo';
const getAccountSupport = (state) => state.account.support;

export const entitledToOnlineSupport = createSelector(
  [getAccountSupport],
  (support) => support && support.online
);

export const entitledToPhoneSupport = createSelector(
  [getAccountSupport],
  (support) => support && support.phone
);

export const allowSendingLimitRequestSelector = createSelector(
  [currentPlanSelector],
  (currentPlan) => currentPlan.status !== 'deprecated' && !(currentPlan.isFree)
);

export const currentLimitSelector = (state) => {
  const { account } = state;
  return _.get(account, 'usage.day.limit', 0);
};
