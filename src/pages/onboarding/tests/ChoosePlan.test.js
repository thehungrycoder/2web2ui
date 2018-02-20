import { shallow } from 'enzyme';
import React from 'react';
import { OnboardingPlanPage as ChoosePlan } from '../ChoosePlan';

describe('ChoosePlan page tests', () => {
  let wrapper;
  let instance;

  const props = {
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn(),
    history: {
      push: jest.fn()
    },
    loading: false
  };

  beforeEach(() => {
    wrapper = shallow(<ChoosePlan {...props}/>);
    instance = wrapper.instance();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading component', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('should go to next page if plan is free, no-op', async() => {
      await instance.onSubmit({ planpicker: { isFree: true }});
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.billingCreate).not.toHaveBeenCalled();
    });

    it('should create billing record on submission', async() => {
      const values = { planpicker: { isFree: false }, key: 'value' };
      await instance.onSubmit(values);
      expect(instance.props.billingCreate).toHaveBeenCalledWith(values);
      expect(instance.props.history.push).toHaveBeenCalledWith('/onboarding/sending-domain');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Added plan' });
    });

    it('should show error alert on failure', async() => {
      wrapper.setProps({ billingCreate: jest.fn(() => Promise.reject(new Error('plan failed'))) });
      await instance.onSubmit({ planpicker: { isFree: false }});
      expect(instance.props.billingCreate).toHaveBeenCalled();
      expect(instance.props.history.push).not.toHaveBeenCalled();
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Adding plan failed', details: 'plan failed' });
    });
  });

});
