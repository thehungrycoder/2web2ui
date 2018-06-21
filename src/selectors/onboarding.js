import { formValueSelector } from 'redux-form';
import { createStructuredSelector } from 'reselect';
import { selectVisiblePlans } from 'src/selectors/accountBillingInfo';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';

const getChoosePlanInitialValues = (state, props) => {
  const { plan: planCode } = (props.location.state || {});
  return changePlanInitialValues(state, { planCode });
};

// For more on createStructedSelector, see:
// https://github.com/reduxjs/reselect#createstructuredselectorinputselectors-selectorcreator--createselector
export const choosePlanMSTP = (formName) => createStructuredSelector({
  loading: (state) => Boolean(state.account.loading || state.billing.plansLoading || state.billing.countriesLoading),
  billing: (state) => state.billing,
  plans: (state) => selectVisiblePlans(state),
  initialValues: getChoosePlanInitialValues,
  selectedPlan: (state) => formValueSelector(formName)(state, 'planpicker'),
  hasError: (state) => Boolean(state.billing.plansError || state.billing.countriesError)
});
