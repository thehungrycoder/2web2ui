import React from 'react';
import { BouncePage } from '../BouncePage';
import { shallow, mount } from 'enzyme';

describe('BouncePage: ', () => {

  const props = {
    loading: false,
    aggregates: {
      countBounce: 1,
      countTargeted: 10
    },
    totalBounces: 100,
    reportOptions: {
      relativeRange: 'hour'
    },
    addFilters: jest.fn(),
    refreshBounceReport: jest.fn(),
    reasons: [ {
      bounce_category_name: 'Block',
      bounce_class_description: 'The message was blocked by the receiver as coming from a known spam source',
      bounce_class_name: 'Spam Block',
      classification_id: 51,
      count_bounce: 5,
      domain: 'yahoo.com',
      reason: '554 - 5.7.1 Blacklisted by \'twoomail.com\'(twoo.com.multi.surbl.org) Contact the postmaster of this domain for resolution. This attempt has been logged.'
    } ],
    searchOptions: {}
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BouncePage {...props} />);
  });

  it('should render', () => {
    expect(props.refreshBounceReport).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh when report options reference changes', () => {
    const newReportOptions = {};
    expect(props.refreshBounceReport).not.toHaveBeenCalled();
    wrapper.setProps({ reportOptions: newReportOptions });
    expect(props.refreshBounceReport).toHaveBeenCalledWith(newReportOptions);
  });

  it('should render correctly with no bounces', () => {
    wrapper.setProps({ aggregates: {}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading panel when table is loading', () => {
    wrapper.setProps({ tableLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should display loading panel on top level metrics when aggregates are loading', () => {
    wrapper.setProps({ chartLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not display top level metrics when there are no aggregates', () => {
    wrapper.setProps({ aggregates: {}});
    expect(wrapper.find('MetricsSummary')).toHaveLength(0);
  });

  it('should show empty reasons table when there are no reasons', () => {
    wrapper.setProps({ reasons: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render row data properly', () => {
    const rows = wrapper.instance().getRowData({
      reason: 'u y bounce?',
      domain: 'gmail',
      bounce_category_name: 'bouncy',
      count_bounce: 10
    });

    expect(rows).toMatchSnapshot();
  });

  it('should filter by domain', () => {
    const rows = wrapper.instance().getRowData({
      reason: 'u y bounce?',
      domain: 'gmail',
      bounce_category_name: 'bouncy',
      count_bounce: 10
    });

    const link = mount(rows[1]);
    link.find('UnstyledLink').simulate('click');
    expect(props.addFilters).toHaveBeenCalledWith([{ type: 'Recipient Domain', value: 'gmail' }]);
  });

});
