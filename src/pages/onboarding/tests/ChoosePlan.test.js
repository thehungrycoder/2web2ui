import { shallow } from 'enzyme';
import React from 'react';
import { OnboardingPlanPage as ChoosePlan } from '../ChoosePlan';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/helpers/billing');

describe('ChoosePlan page tests', () => {
  let wrapper;
  let instance;

  const props = {
    hasError: false,
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    verifyPromoCode: jest.fn(() => Promise.resolve({ discount_id: 'test-discount' })),
    history: {
      push: jest.fn()
    },
    loading: false,
    billing: { countries: [], selectedPromo: {}, promoPending: false },
    plans: [],
    submitting: false
  };

  beforeEach(() => {
    wrapper = shallow(<ChoosePlan {...props}/>);
    instance = wrapper.instance();
    billingHelpers.prepareCardInfo = jest.fn((a) => a);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(instance.props.history.push).not.toHaveBeenCalled();
  });

  it('should render loading component', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to next step when api calls fail', () => {
    wrapper.setProps({ hasError: true });
    expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
  });

  it('should show free bullets when isFree is selected', () => {
    wrapper.setProps({ selectedPlan: { isFree: true }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable submit and plan picker when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('should not need valid cc info for a free plan selection', async () => {
      await instance.onSubmit({ planpicker: { code: 'free', isFree: true }});
      expect(billingHelpers.prepareCardInfo).not.toHaveBeenCalled();
    });

    it('should prepare cc info for a paid plan selection', async () => {
      await instance.onSubmit({
        planpicker: { code: 'paid' },
        card: { number: '411', name: 'Captain Moneybags' }
      });
      expect(billingHelpers.prepareCardInfo).toHaveBeenCalledWith({ number: '411', name: 'Captain Moneybags' });
    });

    it('should go to next page if plan is free, no-op', async () => {
      await instance.onSubmit({ planpicker: { isFree: true }});
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.billingCreate).not.toHaveBeenCalled();
    });

    it('should create billing record on submission', async () => {
      const values = { planpicker: { isFree: false }, key: 'value', card: 'card info' };
      await instance.onSubmit(values);
      expect(instance.props.billingCreate).toHaveBeenCalledWith(values);
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Added your plan' });
    });

    it('should call verify of promo code before rest of submission flow if available', async () => {
      const values = { planpicker: { isFree: false, billingId: 'test-id' }, key: 'value', card: 'card info', promoCode: 'test-promo-code' };
      wrapper.setProps({ billing: { ...props.billing, selectedPromo: { promoCode: 'test-promo-code' }}});
      await instance.onSubmit(values);
      expect(props.verifyPromoCode).toHaveBeenCalledWith({
        promoCode: 'test-promo-code',
        billingId: 'test-id',
        meta: { promoCode: 'test-promo-code' }
      });
      expect(instance.props.billingCreate).toHaveBeenCalledWith({ ...values, discountId: 'test-discount' });
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Added your plan' });
    });

    it('should throw error if promo code validation fails', async () => {
      expect.assertions(2);
      const values = { planpicker: { isFree: false, billingId: 'test-id' }, key: 'value', card: 'card info' };
      const verifyPromoCode = jest.fn(() => Promise.reject());
      wrapper.setProps({ billing: { ...props.billing, selectedPromo: { promoCode: 'test-promo-code' }}, verifyPromoCode });
      return instance.onSubmit(values).catch(() => {
        expect(props.billingCreate).not.toHaveBeenCalled();
        expect(props.history.push).not.toHaveBeenCalled();
      });
    });

    it('should throw error if billing creation fails', async () => {
      expect.assertions(2);
      const values = { planpicker: { isFree: false, billingId: 'test-id' }, key: 'value', card: 'card info' };
      const billingCreate = jest.fn(() => Promise.reject());
      wrapper.setProps({ billing: { ...props.billing, selectedPromo: { promoCode: 'test-promo-code' }}, billingCreate });
      return instance.onSubmit(values).catch(() => {
        expect(props.billingCreate).not.toHaveBeenCalled();
        expect(props.history.push).not.toHaveBeenCalled();
      });
    });
  });
});
