import { selectCurrentPlan } from './accountBillingInfo';

/**
 * Selects initial values for all the forms on account/billing/plan
 */
export function selectInitialValues(state) {
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

/**
 * Prefill billing address form
 */
// function selectAccountBilling(state) {
//   const { billing } = state.account;
//
//   if (billing) { // TODO dont want to return this if on free plan
//     return {
//       firstName: billing.first_name,
//       lastName: billing.last_name,
//       country: billing.country_code,
//       streetAddress: billing.address1,
//       state: billing.state,
//       zip: billing.zip_code
//     };
//   }
//
//   // Default billing address form values
//   return {
//     firstName: state.currentUser.first_name,
//     lastName: state.currentUser.last_name,
//     country: '_placeholder'
//   };
// }
