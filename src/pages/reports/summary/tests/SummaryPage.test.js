import React from 'react';
import { shallow } from 'enzyme';
import { SummaryReportPage } from '../SummaryPage';
import * as reportHelpers from 'src/helpers/reports';
import Filters from '../../components/Filters';
import ShareModal from '../../components/ShareModal';
import { MetricsModal, ChartHeader } from '../components';

jest.mock('src/helpers/reports');

describe('Page: SummaryPage', () => {

  let wrapper;
  let testProps;

  beforeEach(() => {
    reportHelpers.getFilterSearchOptions = jest.fn(() => ({}));
    reportHelpers.parseSearch = jest.fn(() => ({ options: {}}));
    testProps = {
      filters: [],
      chart: {
        metrics: [1, 2, 3]
      },
      location: {
        search: '?hello'
      },
      history: {
        replace: jest.fn()
      },
      refreshSummaryChart: jest.fn(() => Promise.resolve()),
      initTypeaheadCache: jest.fn(),
      addFilters: jest.fn()
    };
    wrapper = shallow(<SummaryReportPage {...testProps} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when loading', () => {
    testProps.chart.chartLoading = true;
    wrapper = shallow(<SummaryReportPage {...testProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should add any found filters', () => {
    reportHelpers.parseSearch = jest.fn(() => ({
      options: {},
      filters: [1, 2, 3]
    }));
    wrapper = shallow(<SummaryReportPage {...testProps} />);
    expect(testProps.addFilters).toHaveBeenCalledWith([1, 2, 3]);
  });

  it('should toggle modals via filters', () => {
    const filters = wrapper.find(Filters);
    expect(wrapper.state('shareModal')).toEqual(false);
    filters.simulate('share');
    expect(wrapper.state('shareModal')).toEqual(true);
    filters.simulate('share');
    expect(wrapper.state('shareModal')).toEqual(false);
  });

  it('should toggle modals via chart header', () => {
    const header = wrapper.find(ChartHeader);
    expect(wrapper.state('metricsModal')).toEqual(false);
    header.simulate('metricsToggle');
    expect(wrapper.state('metricsModal')).toEqual(true);
    header.simulate('metricsToggle');
    expect(wrapper.state('metricsModal')).toEqual(false);
  });

  it('should toggle modals via share modal toggle', () => {
    const toggle = wrapper.find(ShareModal).props().handleToggle;
    expect(wrapper.state('shareModal')).toEqual(false);
    toggle();
    expect(wrapper.state('shareModal')).toEqual(true);
    toggle();
    expect(wrapper.state('shareModal')).toEqual(false);
  });

  it('should toggle modals via metrics modal cancel', () => {
    const modal = wrapper.find(MetricsModal);
    expect(wrapper.state('metricsModal')).toEqual(false);
    modal.simulate('cancel');
    expect(wrapper.state('metricsModal')).toEqual(true);
    modal.simulate('cancel');
    expect(wrapper.state('metricsModal')).toEqual(false);
  });

  it('should apply metrics via metrics modal submit', () => {
    wrapper.setState({ metricsModal: true });
    const modal = wrapper.find(MetricsModal);
    const metrics = {};
    modal.simulate('submit', metrics);
    expect(testProps.refreshSummaryChart).toHaveBeenCalledWith({ metrics });
    expect(wrapper.state('metricsModal')).toEqual(false);
  });

  it('should handle scale changes', () => {
    const header = wrapper.find(ChartHeader);
    header.simulate('scaleClick', 'test-scale');
    expect(wrapper.state('scale')).toEqual('test-scale');
  });

  it('should handle time changes', () => {
    const header = wrapper.find(ChartHeader);
    header.simulate('timeClick', 'test-time');
    expect(wrapper.state('eventTime')).toEqual('test-time');
  });

});
