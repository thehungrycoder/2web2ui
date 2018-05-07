import _ from 'lodash';
import { createSelector } from 'reselect';
import { currentPlanSelector } from './accountBillingInfo';
import accessConditionState from './accessConditionState';
import supportIssues from 'src/config/supportIssues';

const getAccountSupport = (state) => state.account.support;
const getSupportIssueId = (state, id) => id;

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

export const selectSupportIssues = createSelector(accessConditionState, (state) => (
  supportIssues.filter(({ condition = () => true }) => condition(state))
));

export const selectSupportIssue = createSelector(
  [selectSupportIssues, getSupportIssueId],
  (issues, id) => _.find(issues, { id })
);
