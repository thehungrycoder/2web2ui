import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');
jest.mock('src/actions/reportFilters');

describe('Action Creator: Bounce Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let fetchSpy;

  beforeEach(() => {
    const metrics = 'count_bounce';
    fetchSpy = jest.spyOn(metricsActions, 'fetchDeliverability');
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);
    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from, metrics }));


    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should dispatch a chart refresh action', async() => {
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should not refresh chart nor update bounce classifications if 0 bounces', async() => {
    metricsActions.fetchDeliverability = jest.fn(() => [{ foo: 'bar' }]);
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();

  });

  it('should dispatch a table refresh action', async() => {
    const thunk = bounceReport.refreshBounceTableMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
