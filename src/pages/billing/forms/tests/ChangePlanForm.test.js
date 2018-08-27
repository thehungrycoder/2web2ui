import React from 'react';
import { ChangePlanForm } from '../ChangePlanForm';
import { shallow } from 'enzyme';
import * as accountConditions from 'src/selectors/accessConditionState';
import * as conversions from 'src/helpers/conversionTracking';
import * as billingHelpers from 'src/helpers/billing';

jest.mock('src/helpers/billing');
jest.mock('src/selectors/accessConditionState');
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

  let props;

  beforeEach(() => {
    props = {
      account: {
        subscription: { self_serve: true, code: 'free' },
        billing: {}
      },
      isSelfServeBilling: true,
      billing: { countries: [], plans },
      getPlans: jest.fn(),
      getBillingCountries: jest.fn(),
      fetchAccount: jest.fn(),
      plans,
      currentPlan: {},
      selectedPlan: {},
      canUpdateBillingInfo: false,
      history: { push: jest.fn(), replace: jest.fn() },
      location: {
        pathname: '/account/billing/plan',
        search: 'immediatePlanChange=free-0817&pass=through'
      },
      handleSubmit: jest.fn(),
      showAlert: jest.fn(),
      billingCreate: jest.fn(() => Promise.resolve()),
      billingUpdate: jest.fn(() => Promise.resolve()),
      updateSubscription: jest.fn(() => Promise.resolve()),
      isAws: false
    };
    accountConditions.isAws = jest.fn(() => false);
    wrapper = shallow(<ChangePlanForm {...props} />);
    instance = wrapper.instance();
    submitSpy = jest.spyOn(instance.props, 'handleSubmit');
    billingHelpers.prepareCardInfo = jest.fn((a) => a);
    billingHelpers.stripImmediatePlanChange = jest.fn(() => 'pass=through');
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get plans and countries on mount', () => {
    expect(props.fetchAccount).toHaveBeenCalledWith(expect.objectContaining({
      include: expect.stringContaining('billing')
    }));
    expect(props.getPlans).toHaveBeenCalled();
    expect(props.getBillingCountries).toHaveBeenCalled();
  });

  it('should not show plans', () => {
    wrapper.setProps({ plans: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show saved card', () => {
    expect(wrapper).toHaveState('useSavedCC', null);
    wrapper.setProps({ canUpdateBillingInfo: true });
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
      values = { key: 'value', planpicker: { code: 'paid' }, card: 'card info' };
    });

    // Upgrade from free to new paid plan for the first time
    it('should call billingCreate when no billing account exists', async () => {
      const { billing, ...account } = props.account;
      wrapper.setProps({ account }); // remove billing from account
      await instance.onSubmit(values);
      expect(props.billingCreate).toHaveBeenCalledWith(values);
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    // Changing plan and changing card
    it('should update billing account when billing account exists entering a new cc', async () => {
      await instance.onSubmit(values);
      expect(props.billingUpdate).toHaveBeenCalledWith(values);
      expect(props.updateSubscription).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should update subscription for aws account', async () => {
      wrapper.setProps({ isAws: true });
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'paid' });
    });

    // Changing plan and using existing card
    it('should update subscription when billing account exists without entering new cc info', async () => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'paid' });
      expect(props.billingUpdate).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    // Downgrade to free
    it('should update subscription on downgrade to free', async () => {
      wrapper.setState({ useSavedCC: true });
      wrapper.setProps({ account: { billing: true, subscription: { self_serve: true }}});
      await instance.onSubmit({ ...values, planpicker: { code: 'free', isFree: true }});
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'free' });
      expect(props.billingUpdate).not.toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should not prepare card info if downgrading to free', async () => {
      await instance.onSubmit({ ...values, planpicker: { code: 'free', isFree: true }});
      expect(billingHelpers.prepareCardInfo).not.toHaveBeenCalled();
    });

    it('should prepare card info if changing to paid plan', async () => {
      await instance.onSubmit({ ...values, planpicker: { code: 'paid' }});
      expect(billingHelpers.prepareCardInfo).toHaveBeenCalledWith(values.card);
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

  describe('immediate plan change tests', () => {
    it('should handle plan change immediately', async () => {
      props.immediatePlanChange = 'free-0817';
      wrapper = shallow(<ChangePlanForm {...props} />);
      await instance.handleImmediatePlanChange();

      expect(props.history.replace).toHaveBeenCalledWith({
        pathname: '/account/billing/plan',
        search: 'pass=through'
      });
      expect(props.updateSubscription).toHaveBeenCalledWith({ code: 'free-0817' });
      expect(props.history.push).toHaveBeenCalledWith('/account/billing');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Subscription Updated' });
    });

    it('should not change plan without immediatePlanChange', async () => {
      wrapper = shallow(<ChangePlanForm {...props} />);
      expect(props.history.replace).not.toHaveBeenCalled();
      expect(props.updateSubscription).not.toHaveBeenCalled();
      expect(props.history.push).not.toHaveBeenCalled();
      expect(props.showAlert).not.toHaveBeenCalled();
    });
  });
});
