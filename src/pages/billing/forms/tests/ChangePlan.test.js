import React from 'react';
import { ChangePlan } from '../ChangePlan';
import { shallow } from 'enzyme';

describe('Form Container: Change Plan', () => {
  let wrapper;

  const props = {
    account: {
      subscription: { self_serve: true }
    },
    billing: { countries: []},
    plans: [],
    currentPlan: {},
    selectedPlan: {},
    shouldExposeCard: false,
    handleSubmit: jest.fn(),
    showAlert: jest.fn(),
    billingCreate: jest.fn(() => Promise.resolve()),
    billingUpdate: jest.fn(() => Promise.resolve()),
    updateSubscription: jest.fn(() => Promise.resolve())
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlan {...props} />);
  });

  it('should render', () => {
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

  it('should submit redux-form', () => {
    const submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalled();
  });

  it('should create zuora account', () => {
    const createSpy = jest.spyOn(wrapper.instance().props, 'billingCreate');
    wrapper.instance().onSubmit('hello');
    expect(createSpy).toHaveBeenCalledWith('hello');
  });

  it('should update zuora', () => {
    const newProps = {
      account: {
        billing: {},
        subscription: { self_serve: true }
      }
    };
    const updateSpy = jest.spyOn(wrapper.instance().props, 'billingUpdate');
    wrapper.setProps(newProps);
    wrapper.instance().onSubmit('hi');
    expect(updateSpy).toHaveBeenCalledWith('hi');
  });

  it('should update plan', () => {
    const newProps = {
      account: {
        billing: {},
        subscription: { self_serve: true }
      }
    };
    const subSpy = jest.spyOn(wrapper.instance().props, 'updateSubscription');
    const planpicker = { planpicker: { code: 'newplan' }};
    wrapper.setProps(newProps);
    wrapper.setState({ useSavedCC: true });
    wrapper.instance().onSubmit(planpicker);
    expect(subSpy).toHaveBeenCalledWith('newplan');
  });
});
