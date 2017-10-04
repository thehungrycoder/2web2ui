import { changePlanInitialValues } from '../accountBillingForms';
import * as billingInfo from '../accountBillingInfo';

describe('Initial Values: change plan', () => {
  const store = {
    currentUser: {
      first_name: 'ann',
      last_name: 'perkins',
      email: 'ann@perkins.com'
    }
  };

  billingInfo.selectCurrentPlan = jest.fn(() => 'Plan');

  it('should return user name, email, and plan', () => {
    expect(changePlanInitialValues(store)).toMatchSnapshot();
  });
});
