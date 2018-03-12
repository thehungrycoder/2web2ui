import { changePlanInitialValues, updatePaymentInitialValues, updateContactInitialValues } from '../accountBillingForms';
import * as billingInfo from '../accountBillingInfo';

describe('Billing Initial Values', () => {
  const user = {
    first_name: 'ann',
    last_name: 'perkins',
    email: 'ann@perkins.com',
    country_code: 'GG',
    state: 'EZ',
    zip_code: '54321'
  };

  describe('changePlanInitialValues', () => {
    let user;
    let store;

    beforeEach(() => {
      user = {
        first_name: 'ann',
        last_name: 'perkins',
        email: 'ann@perkins.com',
        country_code: 'GG',
        state: 'EZ',
        zip_code: '54321'
      };
      store = { currentUser: user };
      billingInfo.currentPlanSelector = jest.fn();
      billingInfo.publicPlansSelector = jest.fn();
      billingInfo.isSelfServeOrAWSSelector = jest.fn(() => false);
      billingInfo.getPlansSelector = jest.fn();
    });

    it('should return change plan values: with a billing id', () => {
      billingInfo.currentPlanSelector.mockReturnValue({ billingId: '1', code: 'abc' });
      expect(changePlanInitialValues(store)).toMatchSnapshot();
    });

    it('should return change plan values: without billing id', () => {
      billingInfo.currentPlanSelector.mockReturnValue({ code: 'abc' });
      billingInfo.getPlansSelector.mockReturnValue([
        { isFree: true, code: 'im free' },
        { isFree: false, code: 'im not free' }
      ]);

      expect(changePlanInitialValues(store)).toMatchSnapshot();
    });
  });


  it('should return update payment values', () => {
    const store = { currentUser: user };
    expect(updatePaymentInitialValues(store)).toMatchSnapshot();
  });

  it('should return update contact values', () => {
    const store = { account: { billing: user }};
    expect(updateContactInitialValues(store)).toMatchSnapshot();
  });
});
