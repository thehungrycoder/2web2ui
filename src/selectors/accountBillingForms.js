import _ from 'lodash';
import { currentPlanSelector, deepLinkablePlansSelector, getPlansSelector } from './accountBillingInfo';
import { isSelfServeBilling } from 'src/helpers/conditions/account';

export function onboardingInitialValues(state, { plan: code } = {}) {
  const plans = getPlansSelector(state);
  const initialPlan = _.find(deepLinkablePlansSelector(state), { code }) || _.first(plans);

  return {
    planpicker: initialPlan,
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name
    }
  };
}

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function changePlanInitialValues(state, { code } = {}) {
  let initialPlan = _.find(deepLinkablePlansSelector(state), { code }) || currentPlanSelector(state);

  // Plans outside zuora won't be selectable through plan picker (only possible through manually billed accounts)
  // Picker default to the highest plan
  if (!initialPlan.hasOwnProperty('billingId') && !isSelfServeBilling(state)) {
    initialPlan = _.last(getPlansSelector(state));
  }

  return {
    email: state.currentUser.email, // This sets the email value even though the field does not exist
    planpicker: initialPlan,
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name
    }
  };
}

/**
 * Selects initial values for all the update payment form on the summary page
 */
export function updatePaymentInitialValues(state) {
  return {
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name
    }
  };
}

/**
 * Selects initial values for the update contact form on the summary page
 */
export function updateContactInitialValues(state) {
  const { billing } = state.account;
  return {
    billingContact: {
      email: billing.email,
      firstName: billing.first_name,
      lastName: billing.last_name,
      country: billing.country_code,
      state: billing.state,
      zip: billing.zip_code
    }
  };
}
