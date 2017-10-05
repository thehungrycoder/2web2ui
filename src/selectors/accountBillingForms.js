import { selectCurrentPlan } from './accountBillingInfo';

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function changePlanInitialValues(state) {
  return {
    email: state.currentUser.email, // This sets the email value even though the field does not exist
    planpicker: selectCurrentPlan(state),
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
  return {
    billingContact: {
      email: state.account.billing.email,
      firstName: state.account.billing.first_name,
      lastName: state.account.billing.last_name
    }
  };
}
