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
    jest.clearAllMocks();
    spyParseSearch = reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));

    reportHelpers.getShareLink.mockReturnValue({ search: 'foo=bar', link: 'http://an-awesome-link-to-share.com' });

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
      refreshRejectionTableMetrics: jest.fn(() => Promise.resolve()),
      refreshTypeaheadCache: jest.fn(),
      addFilter: jest.fn(),
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

  afterEach(() => {
    spyParseSearch.mockRestore();
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

  it('renders correctly with no rejections', () => {
    wrapper.setProps({ list: []});
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleDomainClick', () => {
    it('sets the filter and refresh', () => {
      props.refreshRejectionTableMetrics.mockClear(); //clear any usages by initial rendering (componentDidMount)
      wrapper.instance().handleDomainClick('abc.com');
      expect(props.addFilter).toHaveBeenCalledTimes(1);
      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledTimes(1);
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
      props.refreshRejectionTableMetrics.mockClear(); //clear any usages by initial rendering (componentDidMount)
      const options = { relativeRange: '7days' };
      await wrapper.instance().handleRefresh(options);
      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledTimes(1);
      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledWith(options);
      expect(props.showAlert).toHaveBeenCalledTimes(0);
    });

    it('alerts on error', async() => {
      props.refreshRejectionTableMetrics.mockClear();
      const err = new Error('dooms day!');
      props.refreshRejectionTableMetrics.mockReturnValue(Promise.reject(err));
      await wrapper.instance().handleRefresh();

      expect(props.refreshRejectionTableMetrics).toHaveBeenCalledWith(undefined);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('parseSearch', () => {
    it('parses query params correctly', () => {
      props.addFilter.mockClear();

      const from = new Date('2016');
      const to = new Date();
      const filter = { type: 'Recipient Domain', value: 'gmail.com' };

      reportHelpers.parseSearch.mockReturnValue({
        options: { to, from },
        filters: [filter]
      });

      expect(wrapper.instance().parseSearch()).toEqual({ from, to });
      expect(props.addFilter).toHaveBeenCalledTimes(1);
      expect(props.addFilter).toHaveBeenCalledWith(filter, expect.anything(), [filter]); //I wish if I could care just about first arg
    });
  });
});
