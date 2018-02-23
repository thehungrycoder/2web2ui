/* eslint-disable max-lines */
import * as reportOptions from '../reportOptions';
import * as metrics from 'src/actions/metrics';
import { listTemplates } from 'src/actions/templates';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { list as listSendingDomains } from 'src/actions/sendingDomains';
import { getRelativeDates, isSameDate } from 'src/helpers/date';

jest.mock('src/helpers/date');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/templates');
jest.mock('src/actions/subaccounts');
jest.mock('src/actions/sendingDomains');

describe('Action Creator: Report Filters', () => {
  let dispatchMock;
  let testState;
  let getStateMock;

  beforeEach(() => {
    testState = {
      metrics: {
        campaigns: [],
        domains: [],
        sendingIps: [],
        ipPools: []
      },
      templates: {
        list: []
      },
      subaccounts: {
        list: []
      },
      sendingDomains: {
        list: []
      }
    };
    dispatchMock = jest.fn((a) => a);
    getStateMock = jest.fn(() => testState);
    isSameDate.mockImplementation(() => false);
  });

  describe('initTypeaheadCache', () => {

    it('should dispatch 3 actions', () => {
      reportOptions.initTypeaheadCache()(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(3);
      expect(listTemplates).toHaveBeenCalledTimes(1);
      expect(listSubaccounts).toHaveBeenCalledTimes(1);
      expect(listSendingDomains).toHaveBeenCalledTimes(1);
    });

    it('should skip calls if already in state', () => {
      testState.templates.list.push('template');
      testState.subaccounts.list.push('subaccount');
      testState.sendingDomains.list.push('sending-domain');

      reportOptions.initTypeaheadCache()(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledTimes(0);
      expect(listTemplates).not.toHaveBeenCalled();
      expect(listSubaccounts).not.toHaveBeenCalled();
      expect(listSendingDomains).not.toHaveBeenCalled();
    });

  });

  it('should refresh the metrics lists for the typeahead cache', () => {
    reportOptions.refreshTypeaheadCache({ foo: 'bar' })(dispatchMock);
    expect(metrics.fetchMetricsDomains).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsCampaigns).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsSendingIps).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsIpPools).toHaveBeenCalledTimes(1);
  });

  describe('maybeRefreshTypeaheadCache', () => {

    let currentFrom;
    let currentTo;
    let updatedFrom;

    beforeEach(() => {
      currentFrom = new Date('2018-02-10');
      currentTo = new Date('2018-02-11');
      updatedFrom = new Date(currentFrom);
      updatedFrom.setMonth(currentFrom.getMonth() - 1);

      testState.reportOptions = {
        from: currentFrom,
        to: currentTo,
        relativeRange: 'custom'
      };

      // prevent "all caches empty" scenario by default
      testState.metrics.campaigns.push('campaign-1');
    });

    it('should not refresh if from and to are not changed', async() => {
      isSameDate.mockImplementation(() => true);
      reportOptions.maybeRefreshTypeaheadCache({
        from: currentFrom,
        to: currentTo
      })(dispatchMock, getStateMock);

      expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should refresh if dates change and relative range is "custom"', () => {
      reportOptions.maybeRefreshTypeaheadCache({
        from: updatedFrom,
        to: currentTo,
        relativeRange: 'custom'
      })(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    it('should refresh if dates change and relative range is also changing', () => {
      testState.reportOptions.relativeRange = 'day';
      reportOptions.maybeRefreshTypeaheadCache({
        from: updatedFrom,
        to: currentTo,
        relativeRange: '7days'
      })(dispatchMock, getStateMock);

      expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    it('should not refresh if dates change but relative range stays the same and is not "custom"', () => {
      testState.reportOptions.relativeRange = 'day';
      reportOptions.maybeRefreshTypeaheadCache({
        from: updatedFrom,
        to: currentTo,
        relativeRange: 'day'
      })(dispatchMock, getStateMock);

      expect(dispatchMock).not.toHaveBeenCalled();
    });

  });

  it('should add multiple filters', () => {
    const filters = [];
    expect(reportOptions.addFilters(filters)).toEqual({
      payload: filters,
      type: 'ADD_FILTERS'
    });
  });

  it('should remove a filter', () => {
    const filterToRemove = {};
    expect(reportOptions.removeFilter(filterToRemove)).toEqual({
      type: 'REMOVE_FILTER',
      payload: filterToRemove
    });
  });

  describe('refreshReportOptions', () => {

    let currentFrom;
    let currentTo;
    let updatedFrom;

    beforeEach(() => {
      currentFrom = new Date('2018-02-10');
      currentTo = new Date('2018-02-11');
      updatedFrom = new Date(currentFrom);
      updatedFrom.setMonth(currentFrom.getMonth() - 1);

      testState.reportOptions = {
        from: currentFrom,
        to: currentTo,
        relativeRange: 'custom'
      };
      getRelativeDates.mockImplementation(() => ({ from: 'relative', to: 'relative' }));
    });

    it('should calculate a non-custom relative range', () => {
      const action = reportOptions.refreshReportOptions({ relativeRange: 'day' })(dispatchMock, getStateMock);
      expect(getRelativeDates).toHaveBeenCalledTimes(1);
      expect(action).toEqual({
        type: 'REFRESH_REPORT_OPTIONS',
        payload: expect.objectContaining({
          from: 'relative',
          to: 'relative'
        })
      });
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    it('should calculate a non-custom relative range merged from the redux store', () => {
      testState.reportOptions.relativeRange = 'day';
      const action = reportOptions.refreshReportOptions({ from: currentFrom, to: currentTo })(dispatchMock, getStateMock);
      expect(getRelativeDates).toHaveBeenCalledTimes(1);
      expect(action.payload).toEqual(expect.objectContaining({
        from: 'relative',
        to: 'relative'
      }));
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    it('should NOT calculate a "custom" relative range', () => {
      const action = reportOptions.refreshReportOptions({ from: updatedFrom, relativeRange: 'custom' })(dispatchMock, getStateMock);
      expect(getRelativeDates).not.toHaveBeenCalled();
      expect(action.payload).toEqual(expect.objectContaining({
        from: updatedFrom,
        to: currentTo
      }));
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

    it('should do nothing if dates did not change at all', () => {
      isSameDate.mockImplementation(() => true);
      const action = reportOptions.refreshReportOptions({ from: currentFrom, to: currentTo })(dispatchMock, getStateMock);
      expect(action).toBeUndefined();
      expect(getRelativeDates).not.toHaveBeenCalled();
      expect(dispatchMock).not.toHaveBeenCalled();
    });

    it('should refresh if dates did not change at all but "force" is present', () => {
      isSameDate.mockImplementation(() => true);
      reportOptions.refreshReportOptions({ from: currentFrom, to: currentTo, force: true })(dispatchMock, getStateMock);
      expect(dispatchMock).toHaveBeenCalledTimes(2);
    });

  });

});
