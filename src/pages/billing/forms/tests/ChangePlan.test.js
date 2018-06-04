import React from 'react';
import { ChangePlan } from '../ChangePlan';
import { shallow } from 'enzyme';
import * as accountConditions from 'src/helpers/conditions/account';
import * as conversions from 'src/helpers/conversionTracking';

jest.mock('src/helpers/conversionTracking');

describe('Form Container: Change Plan', () => {
  let wrapper;
  let submitSpy;
  let instance;

  const plans = [
    {
      isFree: false,
      code: 'paid',
      volume: 15000
    },
    {
      isFree: true,
      code: 'free',
      volume: 100000
    }
  ];

  const props = {
    account: {
      subscription: { self_serve: true, code: 'free' }
    },
    isSelfServeBilling: true,
    billing: { countries: [], plans },
    plans,
    currentPlan: {},
    selectedPlan: {},
    canUpdateBillingInfo: false,
    history: { push: jest.fn() },
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    billingUpdate: jest.fn(() => Promise.resolve()),
    updateSubscription: jest.fn(() => Promise.resolve()),
    isAWSAccount: false
  };

  beforeEach(() => {
    accountConditions.isAws = jest.fn(() => false);
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
    wrapper.setProps({ canUpdateBillingInfo: true });
    expect(receiveSpy).toHaveBeenCalledWith({ ...props, canUpdateBillingInfo: true }, {});
    expect(wrapper).toHaveState('useSavedCC', true);
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle toggle', () => {
    wrapper.setProps({ canUpdateBillingInfo: true });
    expect(wrapper.find('CardSummary')).toExist();
    expect(wrapper.find('Connect(PaymentForm)')).not.toExist();
    wrapper.setState({ useSavedCC: false });
    expect(wrapper.find('CardSummary')).not.toExist();
    expect(wrapper.find('Connect(PaymentForm)')).toExist();
  });

  it('should not render payment form if selecting free', () => {
    wrapper.setProps({ selectedPlan: { isFree: true }});
    expect(wrapper.find('CardSummary')).not.toExist();
    expect(wrapper.find('Connect(PaymentForm)')).not.toExist();
    expect(wrapper.find('Connect(BillingAddressForm)')).not.toExist();
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

  describe('onSubmit tests', () => {
    let values;

    beforeEach(() => {
      values = { key: 'value', planpicker: { code: 'paid' }};
    });

    it('should call billingCreate when no billing exists', async () => {
      await instance.onSubmit(values);
      expect(instance.props.billingCreate).toHaveBeenCalledWith(values);
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should update subscription when billing exists and using saved cc', async () => {
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit(values);
      expect(instance.props.billingUpdate).toHaveBeenCalledWith(values);
      expect(instance.props.updateSubscription).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });

    });

    it('should update subscription for aws account', async () => {
      accountConditions.isAws = jest.fn(() => true);
      await instance.onSubmit({ planpicker: { code: 'free' }});
      expect(instance.props.updateSubscription).toHaveBeenCalledWith({ code: 'free' });
    });

    it('should update billing when billing exists but enter new cc info', async () => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ planpicker: { code: 'free' }});
      expect(instance.props.updateSubscription).toHaveBeenCalledWith({ code: 'free' });
      expect(instance.props.billingUpdate).not.toHaveBeenCalled();
      expect(instance.props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(instance.props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should track the plan change', async () => {
      await instance.onSubmit(values);
      expect(conversions.trackPlanChange).toHaveBeenCalledWith({
        allPlans: plans,
        oldCode: 'free',
        newCode: 'paid'
      });
    });
  });
});
