import React from 'react';
import { BillingSummaryPage } from '../SummaryPage';
import { shallow } from 'enzyme';

describe('Page: BillingSummaryPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      account: {
        subscription: {}
      },
      billingInfo: {},
      loading: false,
      sendingIps: {
        list: []
      },
      fetchAccount: jest.fn(),
      getPlans: jest.fn(),
      getSendingIps: jest.fn()
    };
    wrapper = shallow(<BillingSummaryPage {...props} />);
  });

  it('should render correctly when not loading', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should get plans, sending ips and account on mount', () => {
    expect(props.getPlans).toHaveBeenCalledTimes(1);
    expect(props.fetchAccount).toHaveBeenCalledWith({ params: { include: 'billing' }});
    expect(props.getSendingIps).toHaveBeenCalledTimes(1);
  });

});
