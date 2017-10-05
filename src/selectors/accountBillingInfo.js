import _ from 'lodash';
import _fp from 'lodash/fp';

/**
 * Returns true if user should be allowed to change plan
 */
export function canChangePlan(state) {
  const { subscription, isSuspendedForBilling, pending_subscription } = state.account;
  return (subscription && subscription.self_serve) || !isSuspendedForBilling || !pending_subscription;
}

/**
 * Returns true if user has billing account and they are on a paid plan
 */
export function selectBillable(state) {
  const currentPlan = selectCurrentPlan(state);
  return !!state.account.billing && !currentPlan.isFree;
}

/**
 * Get public plans from state and sorts them by volume
 */
export function selectPublicPlans(state) {
  return state.billing.plans
   ? _.sortBy(state.billing.plans.filter((plan) => plan.status === 'public'), (plan) => plan.volume)
   : [];
}

/**
 * Gets current plan
 */
export function selectCurrentPlan(state) {
  return !state.billing.plansLoading && !state.account.loading
    ? _.find(state.billing.plans, { code: state.account.subscription.code })
    : {};
}

/**
 * Gets IP pools and formats for select options
 */
export function selectIpPools(state) {
  return _fp.flow(
    _fp.reject({ id: 'default' }),
    _fp.sortBy(({ name }) => name.toLowerCase()),
    _fp.map(({ name, id }) => ({ label: `${name} [${id}]`, value: id }))
  )(state.ipPools.list);
}
