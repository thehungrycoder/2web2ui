import { currentPlanSelector, publicPlansSelector } from './accountBillingInfo';
import _ from 'lodash';

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function changePlanInitialValues(state) {

  // Plans outside zuora won't be selectable through plan picker
  const currentPlan = currentPlanSelector(state);
  const initialPlan = currentPlan.hasOwnProperty('billingId') ? currentPlan : _.find(publicPlansSelector(state), { isFree: true });

  return {
    email: state.currentUser.email, // This sets the email value even though the field does not exist
    planpicker: initialPlan,
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name,
      country: '_placeholder'
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
      lastName: state.currentUser.last_name,
      country: '_placeholder'
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
