import React from 'react';
import { ChangePlanPage } from '../ChangePlanPage';
import { shallow } from 'enzyme';

jest.mock('src/actions/billing');

describe('Page: ChangePlanPage', () => {
  let wrapper;

  const props = {
    account: {},
    // handleSubmit: jest.fn(),
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    // showAlert: jest.fn(),
    // billingCreate: jest.fn(() => Promise.resolve()),
    // billingUpdate: jest.fn(() => Promise.resolve()),
    // updateSubscription: jest.fn(() => Promise.resolve()),
    // billing: { countries: [] }
  };

  beforeEach(() => {
    wrapper = shallow(<ChangePlanPage {...props} />);
  });

  // it('should render', () => {
  //   expect(wrapper).toMatchSnapshot();
  // });

  it('should get plans and countries on mount', () => {
    const plansSpy = jest.spyOn(wrapper.instance().props, 'getPlans');
    const countrySpy = jest.spyOn(wrapper.instance().props, 'getBillingCountries');
    wrapper.instance().componentWillMount();
    expect(plansSpy).toHaveBeenCalled();
    expect(countrySpy).toHaveBeenCalled();
  });

  it('should render form if allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render form if not allowed to change plan', () => {
    wrapper.setProps({ canChangePlan: false });
    expect(wrapper).toMatchSnapshot();
  });

  // it('should not render form if self serve', () => {
  //   wrapper.setProps({ account: { subscription: { self_serve: false }}});
  //   expect(wrapper.find('form')).not.toBePresent();
  // });

  // it('should render cc summary and toggle', () => {
  //   wrapper.setProps({ canChangePlan: true });
  //   expect(wrapper).toMatchSnapshot();
  //   // expect(wrapper.find('CardSummary')).toBePresent();
  //   // wrapper.instance().handleCardToggle();
  //   // expect(wrapper.find('Connect(PaymentForm)')).toBePresent();
  //   // expect(wrapper.find('Connect(BillingAddressForm)')).toBePresent();
  // });

  // it('should not render payment form if selecting free', () => {
  //   wrapper.setProps({ selectedPlan: { isFree: true }});
  //   expect(wrapper.find('CardSummary')).not.toBePresent();
  //   expect(wrapper.find('Connect(PaymentForm)')).not.toBePresent();
  //   expect(wrapper.find('Connect(BillingAddressForm)')).not.toBePresent();
  // });

  // it('should submit', () => {
  //   const submitSpy = jest.spyOn(wrapper.instance().props, 'handleSubmit');
  //   wrapper.find('form').simulate('submit');
  //   expect(submitSpy).toHaveBeenCalled();
  // });
  //
  // it('should create zuora', () => {
  //   const createSpy = jest.spyOn(wrapper.instance().props, 'billingCreate');
  //   wrapper.instance().updatePlan('hello');
  //   expect(createSpy).toHaveBeenCalledWith('hello');
  // });
  //
  // it('should update zuora', () => {
  //   const updateSpy = jest.spyOn(wrapper.instance().props, 'billingUpdate');
  //   wrapper.setProps({ account: { billing: { test: true }}});
  //   wrapper.instance().updatePlan('hi');
  //   expect(updateSpy).toHaveBeenCalledWith('hi');
  // });
  //
  // it('should update plan', () => {
  //   const subSpy = jest.spyOn(wrapper.instance().props, 'updateSubscription');
  //   const planpicker = { planpicker: { code: 'newplan' }};
  //   wrapper.setProps({ account: { billing: { test: true }}});
  //   wrapper.setState({ useSavedCC: true });
  //   wrapper.instance().updatePlan(planpicker);
  //   expect(subSpy).toHaveBeenCalledWith('newplan');
  // });
});
