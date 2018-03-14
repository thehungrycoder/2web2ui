import React from 'react';
import { ChangePlan } from '../ChangePlan';
import { shallow } from 'enzyme';

describe('Form Container: Change Plan', () => {
  let wrapper;
  let submitSpy;
  let instance;

  const props = {
    account: {
      subscription: { self_serve: true }
    },
    billing: { countries: []},
    plans: [
      {
        isFree: false,
        plan: 'paid'
      },
      {
        isFree: true,
        plan: 'free'
      }
    ],
    currentPlan: {},
    selectedPlan: {},
    shouldExposeCard: false,
    history: { push: jest.fn() },
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    billingUpdate: jest.fn(() => Promise.resolve()),
    updateSubscription: jest.fn(() => Promise.resolve()),
    isAWSAccount: false
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlan {...props} />);
    instance = wrapper.instance();
    submitSpy = jest.spyOn(instance.props, 'handleSubmit');
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show plans', () => {
    wrapper.setProps({ plans: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show saved card', () => {
    const receiveSpy = jest.spyOn(wrapper.instance(), 'componentWillReceiveProps');
    expect(wrapper).toHaveState('useSavedCC', null);
    wrapper.setProps({ shouldExposeCard: true });
    expect(receiveSpy).toHaveBeenCalledWith({ ...props, shouldExposeCard: true }, {});
    expect(wrapper).toHaveState('useSavedCC', true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle toggle', () => {
    wrapper.setProps({ shouldExposeCard: true });
    expect(wrapper.find('CardSummary')).toBePresent();
    expect(wrapper.find('Connect(PaymentForm)')).not.toBePresent();
    wrapper.setState({ useSavedCC: false });
    expect(wrapper.find('CardSummary')).not.toBePresent();
    expect(wrapper.find('Connect(PaymentForm)')).toBePresent();
  });

  it('should not render payment form if selecting free', () => {
    wrapper.setProps({ selectedPlan: { isFree: true }});
    expect(wrapper.find('CardSummary')).not.toBePresent();
    expect(wrapper.find('Connect(PaymentForm)')).not.toBePresent();
    expect(wrapper.find('Connect(BillingAddressForm)')).not.toBePresent();
  });

  it('should toggle savedCard state', () => {
    expect(instance.state.useSavedCC).toEqual(null);
    instance.handleCardToggle();
    expect(instance.state.useSavedCC).toEqual(true);
  });

  it('should submit redux-form', () => {
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should not render ccsection for aws account', () => {
    wrapper.setProps({ isAWSAccount: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('onSubmit tests', () => {
    it('should call bilingCreate when no billing exists', async() => {
      await instance.onSubmit({ key: 'value' });
      expect(instance.props.billingCreate).toHaveBeenCalledWith({ key: 'value' });
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should update subscription when billing exists and using saved cc', async() => {
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ key: 'value' });
      expect(instance.props.billingUpdate).toHaveBeenCalledWith({ key: 'value' });
      expect(instance.props.updateSubscription).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });

    });

    it('should update subscription for aws account', async() => {
      wrapper.setProps({ isAWSAccount: true });
      await instance.onSubmit({ planpicker: { code: 'free' }});
      expect(instance.props.updateSubscription).toHaveBeenCalledWith({ code: 'free', isAWSAccount: true });
    });

    it('should update billing when billing exists but enter new cc info', async() => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ planpicker: { code: 'free' }});
      expect(instance.props.updateSubscription).toHaveBeenCalledWith({ code: 'free' });
      expect(instance.props.billingUpdate).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });
  });
});
