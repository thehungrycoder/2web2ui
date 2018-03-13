import React from 'react';
import { shallow } from 'enzyme';
import BillingSummary from '../BillingSummary';

// mock connected components as named functions for better snapshots
jest.mock('../../forms/UpdatePayment', () => function UpdatePaymentForm() {});
jest.mock('../../forms/UpdateContact', () => function UpdateContactForm() {});
jest.mock('../../forms/AddIps', () => function AddIpsForm() {});

describe('Component: Billing Summary', () => {

  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        billing: {}
      },
      currentPlan: {
        isFree: true
      },
      canChangePlan: true,
      canUpdateBillingInfo: false,
      sendingIps: []
    };
    wrapper = shallow(<BillingSummary {...props} />);
  });

  it('should render correctly for a free plan', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly for a paid plan', () => {
    wrapper.setProps({
      currentPlan: {
        isFree: false
      },
      canUpdateBillingInfo: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly if you can\'t change your plan', () => {
    wrapper.setProps({
      canChangePlan: false
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with the payment info modal open', () => {
    wrapper.instance().handlePaymentModal();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with the billing contact modal open', () => {
    wrapper.instance().handleContactModal();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with IP modal open', () => {
    wrapper.instance().handleIpModal();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle keydown events correctly', () => {
    const instance = wrapper.instance();
    instance.handleModal('tada');
    expect(wrapper.state('show')).toEqual('tada');

    wrapper.instance().handleEscape({ key: 'Enter' });
    expect(wrapper.state('show')).toEqual('tada');

    wrapper.instance().handleEscape({ key: 'Escape' });
    expect(wrapper.state('show')).toEqual(false);
  });

});
