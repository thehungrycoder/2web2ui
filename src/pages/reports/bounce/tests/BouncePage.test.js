import React from 'react';
import { BouncePage } from '../BouncePage';
import { shallow, mount } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';
import Filters from 'src/pages/reports/components/Filters';

jest.mock('src/helpers/reports');

Date.now = jest.fn(() => 1487076708000);

describe('BouncePage: ', () => {

  const props = {
    loading: false,
    aggregates: {
      countBounce: 1,
      countTargeted: 10
    },
    totalBounces: 100,
    filters: {
      relativeRange: 'hour'
    },
    reasons: [ {
      bounce_category_name: 'Block',
      bounce_class_description: 'The message was blocked by the receiver as coming from a known spam source',
      bounce_class_name: 'Spam Block',
      classification_id: 51,
      count_bounce: 5,
      domain: 'yahoo.com',
      reason: '554 - 5.7.1 Blacklisted by \'twoomail.com\'(twoo.com.multi.surbl.org) Contact the postmaster of this domain for resolution. This attempt has been logged.'
    } ],
    refreshBounceChartMetrics: jest.fn((a) => Promise.resolve()),
    refreshBounceTableMetrics: jest.fn((a) => Promise.resolve()),
    refreshTypeaheadCache: jest.fn((a) => Promise.resolve()),
    location: {
      search: {}
    },
    history: {
      replace: jest.fn()
    }
  };

  let wrapper;
  let spyParseSearch;

  beforeEach(() => {
    props.addFilters = jest.fn();
    props.showAlert = jest.fn();
    reportHelpers.getFilterSearchOptions = jest.fn(() => []);
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    reportHelpers.getShareLink = jest.fn(() => ({ link: '', search: '' }));
    wrapper = shallow(<BouncePage {...props} />);
  });

  it('should render', () => {
    expect(props.refreshBounceChartMetrics).toHaveBeenCalled();
    expect(props.refreshBounceTableMetrics).toHaveBeenCalled();
    expect(spyParseSearch).toHaveBeenCalled();
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(props.addFilters).toHaveBeenCalledWith([]);
    expect(wrapper).toMatchSnapshot();
  });

  it('should call addfilters when there are filters', () => {
    reportHelpers.parseSearch = jest.fn(() => ({ options: {}, filters: ['1', '2', '3']}));
    wrapper.instance().parseSearch();
    expect(props.addFilters).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('should show alert when one of the refresh calls fails', async() => {
    wrapper.setProps({ refreshBounceChartMetrics: jest.fn(() => Promise.reject(new Error('failed to load'))) });
    await wrapper.instance().handleRefresh();
    expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to refresh bounce report.', details: 'failed to load' });
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

  it('should show modal toggle', () => {
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.find(Filters).simulate('share');
    expect(stateSpy).toHaveBeenCalled();
  });
});
