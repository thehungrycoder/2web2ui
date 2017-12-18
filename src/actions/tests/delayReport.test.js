import * as delayReport from '../delayReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Delay Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(metricsActions, 'fetchDeliverability');
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_accepted: 100, count_delay: 1 }]);

    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from }));

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should dispatch delay reasons by domain and refresh table', async() => {
    const thunk = delayReport.loadDelayReasonsByDomain();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch delay metrics and refresh the metrics', async() => {
    const thunk = delayReport.loadDelayMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
