import { selectCurrentPlan } from './accountBillingInfo';

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function changePlanValues(state) {
  return {
    email: state.currentUser.email, // This sets the email value even though the field does not exist
    planpicker: selectCurrentPlan(state),
    billingAddress: {
      firstName: state.currentUser.first_name,
      lastName: state.currentUser.last_name,
      country: '_placeholder'
    },
    billingContact: {
      country: '_placeholder'
    }
  };
}
