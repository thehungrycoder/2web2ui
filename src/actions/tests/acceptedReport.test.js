import * as acceptedReport from '../acceptedReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';
import * as reportFilters from 'src/actions/reportFilters';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/accepted');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Accepted Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let stateMock;

  beforeEach(() => {
    const metrics = 'count_accepted';
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_accepted: 1 }]);
    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from, metrics }));
    metricsHelpers.transformData = jest.fn(() => ([{ data: 'transformed data' }]));
    metricsHelpers.getMetricsFromKeys = jest.fn((a) => a);

    stateMock = {};

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => stateMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should dispatch a chart refresh action', async() => {
    const thunk = acceptedReport.refreshAcceptedMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(reportFilters.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(reportFilters.refreshReportRange).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchDeliveriesByAttempt).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchDeliveriesByAttempt.mock.calls).toMatchSnapshot();

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should clear refresh chart nor update deliveries by attempt if 0 accepted', async() => {
    metricsActions.fetchDeliverability = jest.fn(() => [{ foo: 'bar' }]);
    const thunk = acceptedReport.refreshAcceptedMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(metricsActions.fetchDeliverability).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchDeliverability.mock.calls).toMatchSnapshot();
    expect(metricsActions.fetchDeliveriesByAttempt).not.toHaveBeenCalled();

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
