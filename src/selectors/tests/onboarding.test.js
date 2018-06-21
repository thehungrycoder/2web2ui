import { choosePlanMSTP } from '../onboarding';
import { changePlanInitialValues } from 'src/selectors/accountBillingForms';

jest.mock('redux-form', () => ({
  formValueSelector: () => () => 'selected-plan-redux-form-value'
}));

jest.mock('src/selectors/accountBillingForms', () => ({
  changePlanInitialValues: jest.fn(() => 'change-plan-initial-values')
}));

jest.mock('src/selectors/accountBillingInfo', () => ({
  selectVisiblePlans: jest.fn(() => ['visible plans'])
}));

describe('choosePlanMSTP', () => {

  let state;
  let props;

  beforeEach(() => {
    state = {
      account: {},
      billing: {}
    };
    props = {
      location: {}
    };
  });

  it('should return mapped prop values', () => {
    const result = choosePlanMSTP()(state, props);
    expect(result).toMatchSnapshot();
    expect(result.loading).toEqual(false);
    expect(result.hasError).toEqual(false);
    expect(changePlanInitialValues).toHaveBeenCalledWith(state, { planCode: undefined });
  });

  it('should return when there is an error', () => {
    state.billing.plansError = true;
    const result = choosePlanMSTP()(state, props);
    expect(result.hasError).toEqual(true);
  });

  it('should return when loading is true', () => {
    state.account.loading = true;
    const result = choosePlanMSTP()(state, props);
    expect(result.loading).toEqual(true);
  });

  it('should pass on a plan code from location state', () => {
    props.location.state = {
      plan: 'passed-plan'
    };
    choosePlanMSTP()(state, props);
    expect(changePlanInitialValues).toHaveBeenCalledWith(state, { planCode: 'passed-plan' });
  });

});
