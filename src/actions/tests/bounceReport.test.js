import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';
import * as reportFilters from 'src/actions/reportFilters';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Bounce Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let stateMock;

  beforeEach(() => {
    const metrics = 'count_bounce';
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);
    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from, metrics }));

    stateMock = {};

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => stateMock);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should dispatch a chart refresh action', async() => {
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(reportFilters.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(reportFilters.refreshReportRange).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchBounceClassifications).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchBounceClassifications.mock.calls).toMatchSnapshot();

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should not refresh chart nor update bounce classifications if 0 bounces', async() => {
    metricsActions.fetchDeliverability = jest.fn(() => [{ foo: 'bar' }]);
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(metricsActions.fetchDeliverability).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchDeliverability.mock.calls).toMatchSnapshot();
    expect(metricsActions.fetchBounceClassifications).not.toHaveBeenCalled();

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch a table refresh action', async() => {
    const updates = {};
    stateMock.reportFilters = {};
    const mockOptions = {};
    metricsHelpers.buildCommonOptions = jest.fn(() => mockOptions);
    metricsHelpers.getQueryFromOptions = jest.fn(() => ({
      precision: 'cool', // verifying that precision gets stripped out in the snapshot below?
      other: 'stuff'
    }));
    const thunk = bounceReport.refreshBounceTableMetrics(updates);
    await thunk(dispatchMock, getStateMock);
    expect(metricsHelpers.buildCommonOptions).toHaveBeenCalledWith(stateMock.reportFilters, updates);
    expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith(mockOptions);

    expect(metricsActions.fetchBounceReasonsByDomain.mock.calls).toMatchSnapshot();
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
