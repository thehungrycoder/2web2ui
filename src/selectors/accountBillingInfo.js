import { createSelector } from 'reselect';
import _ from 'lodash';
import { isAws, isCustomBilling, isSelfServeBilling, onPlan, onZuoraPlan } from 'src/helpers/conditions/account';
import { selectCondition } from './accessConditionState';

const suspendedSelector = (state) => state.account.isSuspendedForBilling;
const pendingSubscriptionSelector = (state) => state.account.pending_subscription;
const plansSelector = (state) => state.billing.plans || [];
const accountBillingSelector = (state) => state.account.billing;
const selectIsAws = selectCondition(isAws);
const selectIsCustomBilling = selectCondition(isCustomBilling);
const selectIsSelfServeBilling = selectCondition(isSelfServeBilling);
const selectIsCcFree1 = selectCondition(onPlan('ccfree1'));
const selectIsFree1 = selectCondition(onPlan('free1'));
const selectOnZuoraPlan = selectCondition(onZuoraPlan);

export const currentSubscriptionSelector = (state) => state.account.subscription;

/**
 * Returns current subscription's code
 * @param state
 * @return plan code
 */
export const currentPlanCodeSelector = createSelector(
  [currentSubscriptionSelector],
  (subscription = {}) => subscription.code
);

/**
 * Returns true if user does not have pending plan change or is not suspended
 */
export const canChangePlanSelector = createSelector(
  [suspendedSelector, pendingSubscriptionSelector, selectIsCustomBilling],
  (suspended, pendingSubscription, customBilling) => !suspended && !pendingSubscription && !customBilling
);

/**
 * Gets current plan
 */
export const currentPlanSelector = createSelector(
  [currentPlanCodeSelector, plansSelector],
  (currentPlanCode, plans) => _.find(plans, { code: currentPlanCode }) || {}
);

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export const canUpdateBillingInfoSelector = createSelector(
  [currentPlanSelector, accountBillingSelector, selectIsCcFree1],
  (currentPlan, accountBilling, isOnLegacyCcFreePlan) => (
    accountBilling && (isOnLegacyCcFreePlan || !currentPlan.isFree)
  )
);

/**
 * Return true if plan can purchase IP and has billing info (except for aws as it'll be billed outside)
 */
export const canPurchaseIps = createSelector(
  [currentPlanSelector, accountBillingSelector, selectIsAws],
  (currentPlan, accountBilling, isAWSAccount) => currentPlan.canPurchaseIps === true && !!(accountBilling || isAWSAccount)
);

export const selectAvailablePlans = createSelector(
  [plansSelector, selectIsAws, selectIsSelfServeBilling],
  (plans, isAws, isSelfServeBilling) => {
    const availablePlans = plans
      .filter(({ status }) => status === 'public' || status === 'secret')
      // only select AWS plans for AWS users
      .filter(({ awsMarketplace = false }) => awsMarketplace === isAws);

    if (!isSelfServeBilling) {
      _.remove(availablePlans, ({ isFree = false }) => isFree);
    }

    return _.orderBy(availablePlans, 'volume', isSelfServeBilling ? 'asc' : 'desc');
  }
);

export const selectVisiblePlans = createSelector(
  [selectAvailablePlans, selectIsFree1],
  (plans, isOnLegacyFree1Plan) => plans.filter(({ isFree, status }) =>
    status === 'public' &&
        !(isOnLegacyFree1Plan && isFree) //hide new free plans if on legacy free1 plan
  )
);

export const selectBillingInfo = createSelector(
  [
    canUpdateBillingInfoSelector,
    canChangePlanSelector,
    canPurchaseIps,
    currentPlanSelector,
    selectOnZuoraPlan,
    selectVisiblePlans,
    selectIsAws
  ],
  (canUpdateBillingInfo, canChangePlan, canPurchaseIps, currentPlan, onZuoraPlan, plans, isAWSAccount) => ({
    canUpdateBillingInfo,
    canChangePlan,
    canPurchaseIps,
    currentPlan,
    onZuoraPlan,
    plans,
    isAWSAccount
  })
);
