import moment from 'moment';

import * as rejectionReport from '../rejectionReport';
import * as metricsActions from 'src/actions/metrics';
import * as filterActions from 'src/actions/reportFilters';
import * as metricsHelpers from 'src/helpers/metrics';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Rejection Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  const to = moment(new Date(1495394277000)).utc().format('YYYY-MM-DDTHH:MM');
  const precision = 'precise';
  let dispatchMock;
  let getStateMock;
  let reasons;

  beforeEach(() => {
    reasons = [
      {
        'reason': '520 rejection message',
        'domain': 'example.com',
        'count_rejected': 30,
        'rejection_category_id': 2,
        'rejection_type': 'Generation Rejection'
      }
    ];

    metricsActions.fetchRejectionReasonsByDomain = jest.fn(() => Promise.resolve(reasons));
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_rejected: 100, count_targeted: 10000 }]);

    metricsHelpers.buildCommonOptions = jest.fn().mockReturnValue({ from, to, precision });
    metricsHelpers.getQueryFromOptions = jest.fn();
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('refreshRejectionTableMetrics', () => {
    it('dispatchs a refresh action', async() => {
      const thunk = rejectionReport.refreshRejectionTableMetrics();
      await thunk(dispatchMock, getStateMock);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
      expect(filterActions.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
      expect(metricsHelpers.buildCommonOptions).toHaveBeenCalledTimes(1);
      expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith({ from, to, precision });
    });

    it('dispatches refreshReportRange action', async() => {
      const thunk = rejectionReport.refreshRejectionTableMetrics();
      await thunk(dispatchMock, getStateMock);
      expect(filterActions.refreshReportRange).toHaveBeenCalledWith({ from, to, precision });
    });

    it('removes unsupported params', async() => {
      metricsHelpers.getQueryFromOptions.mockReturnValue({ from, to, precision: 'foo', metrics: 'bar', 'domains': 'sparkpost.com' });
      const thunk = rejectionReport.refreshRejectionTableMetrics();
      await thunk(dispatchMock, getStateMock);
      expect(filterActions.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
      expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledTimes(1);
      expect(metricsActions.fetchRejectionReasonsByDomain).toHaveBeenCalledWith({ to, from, domains: 'sparkpost.com' });
    });

    it('dispatches refreshRejectionsTable action', async() => {
      metricsActions.fetchRejectionReasonsByDomain.mockReturnValue(reasons);
      rejectionReport.refreshRejectionsTable = jest.fn();

      const thunk = rejectionReport.refreshRejectionTableMetrics();
      await thunk(dispatchMock, getStateMock);

      const action = {
        type: 'REFRESH_REJECTION_BY_DOMAIN_TABLE',
        payload: { reasons }
      };

      expect(dispatchMock).toHaveBeenLastCalledWith(action);
    });
  });

  describe('loadRejectionMetrics', () => {
    it('should dispatch refresh aggregates action', async() => {
      const thunk = rejectionReport.loadRejectionMetrics({});
      await thunk(dispatchMock, getStateMock);
      expect(metricsHelpers.buildCommonOptions).toHaveBeenCalledTimes(1);
      expect(filterActions.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
      expect(metricsActions.fetchDeliverability.mock.calls).toMatchSnapshot();
      expect(dispatchMock.mock.calls).toMatchSnapshot();

    });

  });

});
