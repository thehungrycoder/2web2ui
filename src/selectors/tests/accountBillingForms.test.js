import { onboardingInitialValues, changePlanInitialValues, updatePaymentInitialValues, updateContactInitialValues } from '../accountBillingForms';
import * as billingInfo from '../accountBillingInfo';
import { isSelfServeBilling } from 'src/helpers/conditions/account';

jest.mock('src/helpers/conditions/account');

const basePlans = [
  { isFree: true, code: 'im free' },
  { isFree: false, code: 'im not free' }
];

const baseUser = {
  first_name: 'ann',
  last_name: 'perkins',
  email: 'ann@perkins.com',
  country_code: 'GG',
  state: 'EZ',
  zip_code: '54321'
};

describe('Selector: Account billing form', () => {
  let plans;
  let user;
  let store;
  let props;

  beforeEach(() => {
    isSelfServeBilling.mockImplementation(() => true);
    plans = basePlans.slice();
    user = Object.assign({}, baseUser);
    store = { currentUser: user };
    props = { location: {}};
  });

  describe('changePlanInitialValues when NOT self serve', () => {
    beforeEach(() => {
      billingInfo.currentPlanSelector = jest.fn();
      billingInfo.deepLinkablePlansSelector = jest.fn();
      billingInfo.publicPlansSelector = jest.fn();
      billingInfo.getPlansSelector = jest.fn();
      isSelfServeBilling.mockImplementation(() => false);
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

    it('should find and return secret plan', () => {
      billingInfo.deepLinkablePlansSelector.mockReturnValue([
        { billingId: 'ABC', code: '50M-shh', status: 'secret' }
      ]);

      expect(changePlanInitialValues(store, { code: '50M-shh' })).toMatchSnapshot();
    });
  });

  describe('onboardingInitialValues', () => {
    beforeEach(() => {
      billingInfo.getPlansSelector = jest.fn(() => plans);
    });

    it('should set reasonable defaults', () => {
      expect(onboardingInitialValues(store, props)).toMatchSnapshot();
    });

    it('should set the plan picker to the plan specified by /join', () => {
      props.location = { state: { plan: 'im not free' }};
      expect(onboardingInitialValues(store, props)).toMatchSnapshot();
    });

    it('should gracefully handle invalid plan values from /join', () => {
      props.location = { state: { plan: 'im not even a real plan' }};
      expect(onboardingInitialValues(store, props)).toMatchSnapshot();
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
