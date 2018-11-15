import * as analytics from './analytics';

// These events are consumed through GTM by various Marketing-owned services to trigger
// follow-on actions.

export function trackPlanChange({ allPlans, oldCode, newCode }) {
  const oldPlan = allPlans.find((plan) => plan.code === oldCode);
  const newPlan = allPlans.find((plan) => plan.code === newCode);
  const action = newPlan.volume > oldPlan.volume ? 'upgrade' : 'downgrade';
  analytics.trackFormSuccess(action, {
    form_type: action,
    plan_key: newPlan.code
  });
}

export function trackDowngradeToFree(newCode) {
  const action = 'downgrade';
  analytics.trackFormSuccess(action, {
    form_type: action,
    plan_key: newCode
  });
}

export function trackAddonPurchase(addonType) {
  const action = 'purchase_addon';
  analytics.trackFormSuccess(action, {
    form_type: action,
    addon_key: addonType
  });
}

export function trackAddonRequest(addonType) {
  analytics.trackEvent({
    category: 'Clicked button',
    action: addonType,
    data: { action: addonType }
  });
}
