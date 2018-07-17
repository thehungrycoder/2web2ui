import { createSelector } from 'reselect';
import * as accountConditions from 'src/helpers/conditions/account';

const getAccount = (state) => state.account;
const getUser = (state) => state.currentUser;
const getPlans = (state) => state.billing.plans || [];
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
 * The following are a list of selectors that make
 * condition helpers available to be used as "regular"
 * selectors by first grabbing the computed access condition
 * state and passing it to the condition, as it expects.
 *
 * Without this, using conditions as selectors would fail
 * because things like 'accountPlan' would not be available.
 *
 * There may be a better way to organize this. :)
 */

export const onPlan = (planCode) => createSelector(
  [selectAccessConditionState],
  (state) => accountConditions.onPlan(planCode)(state)
);

export const isAws = createSelector(
  [selectAccessConditionState],
  accountConditions.isAws
);

export const isSelfServeBilling = createSelector(
  [selectAccessConditionState],
  accountConditions.isSelfServeBilling
);
