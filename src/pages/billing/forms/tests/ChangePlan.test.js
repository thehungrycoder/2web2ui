import React from 'react';
import { ChangePlan } from '../ChangePlan';
import { shallow } from 'enzyme';

describe('Form Container: Change Plan', () => {
  let wrapper;
  let submitSpy;

  const props = {
    account: {
      subscription: { self_serve: true }
    },
    billing: { countries: []},
    plans: [],
    currentPlan: {},
    selectedPlan: {},
    shouldExposeCard: false,
    handleSubmit: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlan {...props} />);
    submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not show confirmation column when onboarding is true', () => {
    wrapper.setProps({ onboarding: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should change onboarding button text when plan is free', () => {
    wrapper.setProps({ onboarding: true, selectedPlan: { isFree: true }});
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
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalledWith(undefined, null);
  });

  it('should update plan', () => {
    wrapper.setState({ useSavedCC: true });
    wrapper.find('form').simulate('submit');
    expect(submitSpy).toHaveBeenCalledWith(undefined, true);
  });
});
