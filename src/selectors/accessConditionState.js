import { createSelector } from 'reselect';
import _ from 'lodash';

const getAccount = (state) => state.account;
const getUser = (state) => state.currentUser;
const getPlans = (state) => _.get(state, 'billing.plans', []);
const getACReady = (state) => state.accessControlReady;

export const getCurrentAccountPlan = createSelector(
  [getAccount, getPlans],
  (account, plans) => plans.find((plan) => plan.code === account.subscription.code) || {}
);

const selectAccessConditionState = createSelector(
  [getAccount, getUser, getPlans, getCurrentAccountPlan, getACReady],
  (account, currentUser, plans, accountPlan, ready) => ({
    account,
    currentUser,
    plans,
    accountPlan,
    ready
  })
);

export default selectAccessConditionState;

/**
 * Use this helper to "wrap" a condition helper and turn it into a "regular selector"
 *
 * Condition helpers expect a very specific state, so using condition helpers directly
 * in mapStateToProps or in other selectors doesn't work. But by using this wrapper,
 * the condition helper will be given the correct state to accurately return its boolean value.
 */

export const selectCondition = (condition) => createSelector([selectAccessConditionState], condition);

