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
  }

  it('should return change plan values: with a billing id', () => {
    const store = { currentUser: user };
    billingInfo.currentPlanSelector = jest.fn(() => ({ billingId: '1', code: 'abc' }));
    expect(changePlanInitialValues(store)).toMatchSnapshot();
  });

  it('should return change plan values: without billing id', () => {
    const store = { currentUser: user };
    billingInfo.currentPlanSelector = jest.fn(() => ({ code: 'notinzuora' }));
    billingInfo.publicPlansSelector = jest.fn(() => ([
      { isFree: true, code: 'im free' },
      { isFree: false, code: 'im not free' }
    ]));
    expect(changePlanInitialValues(store)).toMatchSnapshot();
  });

  it('should return update payment values', () => {
    const store = { currentUser: user };
    expect(updatePaymentInitialValues(store)).toMatchSnapshot();
  });

  it('should return update contact values', () => {
    const store = { account:{ billing: user } };
    expect(updateContactInitialValues(store)).toMatchSnapshot();
  });
});
