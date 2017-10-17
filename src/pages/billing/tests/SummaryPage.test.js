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
    getPlans: jest.fn(),
    getBillingCountries: jest.fn(),
    shouldExposeCard: false,
    canChangePlan: false,
    currentPlan: {},
    plans: []
  };

  beforeEach(() => {
    wrapper = shallow(<SummaryPage {...props} />);
  });

  it('gets plans on mount', () => {
    const plansSpy = jest.spyOn(wrapper.instance().props, 'getPlans');
    wrapper.instance().componentWillMount();
    expect(wrapper).toHaveState('show', false);
    expect(plansSpy).toHaveBeenCalled();
  });

  it('should render banner when manually billed', () => {
    wrapper.setProps({ account: { subscription: { self_serve: false }}});
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

  it('should render billing summary if on paid plan', () => {
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
