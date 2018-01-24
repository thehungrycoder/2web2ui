import * as delayReport from '../delayReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';
import * as reportFilters from 'src/actions/reportFilters';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Delay Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let stateMock;

  beforeEach(() => {
    stateMock = {};
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_accepted: 100, count_delay: 1 }]);
    metricsActions.fetchDelayReasonsByDomain = jest.fn(() => [1,2,3]);
    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from }));

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => stateMock);
  });

  it('should dispatch delay reasons by domain and refresh table', async() => {
    const thunk = delayReport.loadDelayReasonsByDomain();
    await thunk(dispatchMock, getStateMock);
    expect(reportFilters.maybeRefreshTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(reportFilters.refreshReportRange).toHaveBeenCalledTimes(1);
    expect(metricsActions.fetchDelayReasonsByDomain).toHaveBeenCalledTimes(1);

    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch delay metrics and refresh the metrics', async() => {
    const updates = {};
    stateMock.reportFilters = {};
    const mockOptions = {};
    metricsHelpers.buildCommonOptions = jest.fn(() => mockOptions);
    metricsHelpers.getQueryFromOptions = jest.fn(() => ({
      precision: 'cool', // verifying that precision gets stripped out in the snapshot below?
      other: 'stuff'
    }));

    const thunk = delayReport.loadDelayMetrics(updates);
    await thunk(dispatchMock, getStateMock);

    expect(metricsHelpers.buildCommonOptions).toHaveBeenCalledWith(stateMock.reportFilters, updates);
    expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith(mockOptions);

    expect(metricsActions.fetchDeliverability.mock.calls).toMatchSnapshot();
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
