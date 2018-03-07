import React from 'react';
import { SummaryPage } from '../SummaryPage';
import { shallow } from 'enzyme';

describe('Page: SummaryPage', () => {
  let wrapper;

  const props = {
    account: {
      subscription: {}
    },
    billing: {},
    dedicatedIpPrice: jest.fn(() => ''),
    fetchAccount: jest.fn(),
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    getSendingIps: jest.fn(),
    shouldExposeCard: false,
    shouldShowBillingSummary: true,
    canChangePlan: false,
    currentPlan: {},
    plans: [],
    sendingIps: {
      list: []
    }
  };

  beforeEach(() => {
    wrapper = shallow(<SummaryPage {...props} />);
  });

  it('gets plans, sending ips and account on mount', () => {
    const plansSpy = jest.spyOn(wrapper.instance().props, 'getPlans');
    const fetchSpy = jest.spyOn(wrapper.instance().props, 'fetchAccount');
    const getSendingIpsSpy = jest.spyOn(wrapper.instance().props, 'getSendingIps');
    wrapper.instance().componentDidMount();
    expect(wrapper).toHaveState('show', false);
    expect(plansSpy).toHaveBeenCalled();
    expect(fetchSpy).toHaveBeenCalledWith({ include: 'billing' });
    expect(getSendingIpsSpy).toHaveBeenCalled();
  });

  it('should render banner when manually billed', () => {
    wrapper.setProps({ account: { subscription: { self_serve: false }}, shouldShowBillingSummary: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render upgrade on free plan', () => {
    wrapper.setProps({
      canChangePlan: true,
      account: { subscription: { self_serve: true }},
      currentPlan: { isFree: true }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render billing and dedicated IP summary if on paid plan', () => {
    wrapper.setProps({
      canChangePlan: true,
      shouldExposeCard: true,
      account: { subscription: { self_serve: true }},
      currentPlan: { isFree: false }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render billing and ips if on free plan', () => {
    wrapper.setProps({
      canChangePlan: true,
      shouldExposeCard: false,
      account: { subscription: { self_serve: true }},
      currentPlan: { isFree: true }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle modal toggle', () => {
    wrapper.setProps({
      account: { subscription: { self_serve: true }}
    });
    const modalSpy = jest.spyOn(wrapper.instance(), 'handleModal');
    wrapper.setState({ show: 'payment' });
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().handleEscape({ key: 'Escape' });
    expect(modalSpy).toHaveBeenCalled();
    expect(wrapper).toHaveState('show', false);
  });
});
