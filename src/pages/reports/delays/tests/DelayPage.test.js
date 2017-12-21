import React from 'react';
import { DelayPage } from '../DelayPage';
import { shallow, mount } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';
import { renderRowData } from 'src/__testHelpers__';

jest.mock('src/helpers/reports');

Date.now = jest.fn(() => 1487076708000);

describe('DelayPage: ', () => {
  const props = {
    filters: 'new-filter',
    addFilter: jest.fn(),
    tableLoading: false,
    reasons: [
      {
        count_delayed: 100,
        count_delayed_first: 1,
        reason: 'my reason'
      }
    ],
    totalAccepted: 1000,
    loadDelayReasonsByDomain: jest.fn(() => Promise.resolve()),
    refreshTypeaheadCache: jest.fn(() => Promise.resolve()),
    location: { search: {}},
    loadDelayMetrics: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn(),
    history: { replace: jest.fn() }
  };

  let wrapper;
  let spyFilterListFromSearch;
  let spyParseSearch;
  let spyGetShare;

  beforeEach(() => {
    spyFilterListFromSearch = reportHelpers.getFilterSearchOptions = jest.fn(() => []);
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    spyGetShare = reportHelpers.getShareLink = jest.fn(() => ({ link: '', search: '' }));
    wrapper = shallow(<DelayPage {...props} />);
  });

  afterEach(() => {
    spyFilterListFromSearch.mockRestore();
    spyParseSearch.mockRestore();
    spyGetShare.mockRestore();
  });


  it('should render page', () => {
    const parseSpy = jest.spyOn(wrapper.instance(), 'parseSearch');
    wrapper.instance().componentDidMount();
    expect(props.loadDelayMetrics).toHaveBeenCalled();
    expect(props.loadDelayReasonsByDomain).toHaveBeenCalled();
    expect(parseSpy).toHaveBeenCalled();
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(props.addFilter).not.toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show loading indicator when loading table', () => {
    wrapper.setProps({ tableLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show empty message when there are no reasons', () => {
    wrapper.setProps({ reasons: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show an alert when refresh fails', async() => {
    wrapper.setProps({ loadDelayMetrics: jest.fn(() => Promise.reject(new Error('no way jose'))) });
    await wrapper.instance().handleRefresh();
    expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Unable to refresh delay report.', details: 'no way jose' });
  });

  it('should call addFilter when there are filters', () => {
    reportHelpers.parseSearch = jest.fn(() => ({ options: {}, filters: ['1', '2', '3']}));
    wrapper.instance().parseSearch();
    expect(props.addFilter).toHaveBeenCalledTimes(3);
  });

  it('should render row data properly', () => {
    const rows = wrapper.instance().getRowData({ reason: 'bad delay', count_delayed: 1, count_delayed_first: 10, domain: 'gmail.com' });

    expect(renderRowData(rows)).toMatchSnapshot();
  });

  it('should filter by domain', () => {
    const rows = wrapper.instance().getRowData({ reason: 'bad delay', count_delayed: 1, count_delayed_first: 10, domain: 'gmail.com' });
    const link = mount(rows[1]);
    link.find('UnstyledLink').simulate('click');
    expect(props.addFilter).toHaveBeenCalledWith({ type: 'Recipient Domain', value: 'gmail.com' });
  });

  it('should show modal toggle', () => {
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.find('Connect').simulate('share');
    expect(stateSpy).toHaveBeenCalled();
  });

});
