/* eslint max-lines: ["error", 200] */
import React from 'react';
import { RejectionPage } from '../RejectionPage';
import { shallow } from 'enzyme';
import * as reportHelpers from 'src/helpers/reports';

jest.mock('src/helpers/reports');

describe('RejectionPage: ', () => {
  let props;
  let wrapper;
  let spyParseSearch;

  beforeEach(() => {
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));

    props = {
      loading: false,
      filters: {},
      list: [
        {
          count_rejected: 65,
          rejection_category_name: 'Policy Rejection',
          rejection_category_id: 1,
          reason: '551 - Cannot Relay 105',
          domain: 'gmail.com'
        },
        {
          count_rejected: 62,
          rejection_category_name: 'Policy Rejection',
          rejection_category_id: 1,
          reason: '550 - Invalid recipient ...@... (#5.1.1)',
          domain: 'gmail.com'
        }
      ],
      aggregates: {
        count_rejected: 14,
        count_targeted: 100
      },
      loadRejectionMetrics: jest.fn(() => Promise.resolve()),
      refreshRejectionTableMetrics: jest.fn(() => Promise.resolve()),
      refreshTypeaheadCache: jest.fn(),
      addFilters: jest.fn(),
      location: {
        search: {}
      },
      showAlert: jest.fn(),
      history: {
        replace: jest.fn()
      }
    };
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));

    wrapper = shallow(<RejectionPage {...props} />);
  });

  it('renders correctly', () => {
    expect(spyParseSearch).toHaveBeenCalledTimes(1);
    expect(props.refreshTypeaheadCache).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders loading pannel when aggregates are still loading', () => {
    wrapper.setProps({ aggregatesLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not display top level metrics when there are no aggregates', () => {
    wrapper.setProps({ aggregates: {}});
    expect(wrapper.find('MetricsSummary')).toHaveLength(0);
  });

  describe('handleDomainClick', () => {
    it('sets the filter and refresh', () => {
      const value = 'abc.com';

      wrapper.instance().handleDomainClick(value);

      expect(props.addFilters).toHaveBeenCalledWith([{ type: 'Recipient Domain', value }]);
      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledTimes(2); // on load and
    });
  });

  describe('handleModalToggle', () => {
    it('toggles the state value', () => {
      expect(wrapper.state('modal')).toEqual(false);
      wrapper.instance().handleModalToggle();
      expect(wrapper.state('modal')).toEqual(true);
      wrapper.instance().handleModalToggle();
      expect(wrapper.state('modal')).toEqual(false);
    });
  });

  describe('handleRefresh', () => {
    it('refresh rejections', async() => {
      const options = { relativeRange: '7days' };

      await wrapper.instance().handleRefresh(options);

      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledTimes(2);
      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledWith(options);
      expect(props.showAlert).toHaveBeenCalledTimes(0);
    });

    it('alerts on error', async() => {
      const err = new Error('dooms day!');
      props.refreshRejectionTableMetrics.mockReturnValue(Promise.reject(err));

      await wrapper.instance().handleRefresh();

      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledWith(undefined);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('parseSearch', () => {
    it('parses query params correctly', () => {
      const from = new Date('2016');
      const to = new Date();
      const filter = { type: 'Recipient Domain', value: 'gmail.com' };

      reportHelpers.parseSearch.mockReturnValue({
        options: { to, from },
        filters: [filter]
      });

      expect(wrapper.instance().parseSearch()).toEqual({ from, to });
      expect(props.addFilters).toHaveBeenCalledWith([filter]);
    });
  });
});
