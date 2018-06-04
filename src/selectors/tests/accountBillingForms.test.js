import { changePlanInitialValues, updatePaymentInitialValues, updateContactInitialValues } from '../accountBillingForms';
import * as billingInfo from '../accountBillingInfo';

const baseUser = {
  first_name: 'ann',
  last_name: 'perkins',
  email: 'ann@perkins.com',
  country_code: 'GG',
  state: 'EZ',
  zip_code: '54321'
};

describe('Selector: Account billing form', () => {
  let user;
  let store;

  beforeEach(() => {
    billingInfo.selectVisiblePlans = jest.fn(() => [
      { billingId: 'if', code: 'im free', isFree: true, status: 'public' },
      { billingId: 'inf', code: 'im not free', isFree: false, status: 'public' }
    ]);
    billingInfo.selectAvailablePlans = jest.fn(() => [
      { billingId: 'inf', code: 'im not free', isFree: false, status: 'public' },
      { billingId: 'ias', code: 'im a secret', isFree: false, status: 'secret' }
    ]);
    user = Object.assign({}, baseUser);
    store = { currentUser: user };
  });

  describe('changePlanInitialValues when NOT self serve', () => {
    beforeEach(() => {
      billingInfo.currentPlanSelector = jest.fn();
    });

    it('should return change plan values: with a billing id', () => {
      billingInfo.currentPlanSelector.mockReturnValue({ billingId: '1', code: 'abc' });
      expect(changePlanInitialValues(store)).toMatchSnapshot();
    });

    it('should return change plan values: without billing id', () => {
      billingInfo.currentPlanSelector.mockReturnValue({ code: 'abc' });
      expect(changePlanInitialValues(store)).toMatchSnapshot();
    });

    it('should find and return secret plan', () => {
      expect(changePlanInitialValues(store, { planCode: 'im a secret' })).toMatchSnapshot();
    });
  });

  describe('updatePaymentInitialValues', () => {
    it('should return update payment values', () => {
      const store = { currentUser: Object.assign({}, baseUser) };
      expect(updatePaymentInitialValues(store)).toMatchSnapshot();
    });
  });

  describe('updateConteactInitialValues', () => {
    it('should return update contact values', () => {
      const store = { account: { billing: Object.assign({}, baseUser) }};
      expect(updateContactInitialValues(store)).toMatchSnapshot();
    });
  });
});
