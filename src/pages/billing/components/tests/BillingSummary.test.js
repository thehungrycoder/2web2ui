import React from 'react';
import { shallow } from 'enzyme';
import BillingSummary from '../BillingSummary';

// mock connected components as named functions for better snapshots
jest.mock('../../forms/UpdatePaymentForm', () => function UpdatePaymentForm() {});
jest.mock('../../forms/UpdateContactForm', () => function UpdateContactForm() {});
jest.mock('../../forms/AddIps', () => function AddIpsForm() {});

describe('Component: Billing Summary', () => {

  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        billing: {},
        subscription: {
          plan_volume: 15000
        }
      },
      currentPlan: {
        isFree: true
      },
      canChangePlan: true,
      canUpdateBillingInfo: true,
      canPurchaseIps: true,
      sendingIps: [],
      invoices: [],
      accountAgeInDays: 5
    };
    wrapper = shallow(<BillingSummary {...props} />);
  });

  it('should render correctly for a standard free plan', () => {
    wrapper.setProps({ canUpdateBillingInfo: false, canPurchaseIps: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly for a paid plan', () => {
    wrapper.setProps({
      currentPlan: {
        isFree: false
      },
      canPurchaseIps: true,
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

  it('should render correctly if you can\'t update your billing info', () => {
    wrapper.setProps({
      canUpdateBillingInfo: false
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly if you can\'t buy IPs', () => {
    wrapper.setProps({
      canPurchaseIps: false
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

  it('should show the invoice history if there are invoices', () => {
    wrapper.setProps({ invoices: ['an invoice', 'another invoice']});
    expect(wrapper).toMatchSnapshot();
  });

});
