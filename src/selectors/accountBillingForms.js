import { currentPlanSelector, publicPlansSelector, getPlansSelector, isSelfServeOrAWSSelector } from './accountBillingInfo';
import _ from 'lodash';

export function onboardingInitialValues(state) {
  const plans = publicPlansSelector(state);

  return {
    planpicker: _.first(plans),
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name
    }
  };
}

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function changePlanInitialValues(state) {

  let initialPlan = currentPlanSelector(state);

  // Plans outside zuora won't be selectable through plan picker (only possible through manually billed accounts)
  // Picker default to the highest plan
  if (!initialPlan.hasOwnProperty('billingId') && !isSelfServeOrAWSSelector(state)) {
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
