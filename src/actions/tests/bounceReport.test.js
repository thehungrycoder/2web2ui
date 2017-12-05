import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';
import * as dateHelpers from 'src/helpers/date';
import * as filterActions from 'src/actions/reportFilters';
import * as metricsHelpers from 'src/helpers/metrics';

import moment from 'moment';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');

describe('Action Creator: Bounce Report', () => {

  const from = moment(new Date(1487076708000)).utc().format('YYYY-MM-DDTHH:MM');
  const to = moment(new Date(1495394277000)).utc().format('YYYY-MM-DDTHH:MM');
  let dispatchMock;
  let getStateMock;
  let fetchSpy;
  let getRelDatesSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(metricsActions, 'fetchDeliverability');
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);

    getRelDatesSpy = jest.spyOn(dateHelpers, 'getRelativeDates');
    dateHelpers.getRelativeDates = jest.fn(() => ({ from, to }));

    metricsHelpers.getQueryFromOptions.mockImplementation(() => ({ from }));

    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    getRelDatesSpy.mockRestore();
  });

  it('should dispatch a chart refresh action', async () => {
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch a table refresh action', async () => {
    const thunk = bounceReport.refreshBounceTableMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should handle relative range', async () => {
    const thunk = bounceReport.refreshBounceChartMetrics({ relativeRange: 'test' });
    await thunk(dispatchMock, getStateMock);
    expect(dateHelpers.getRelativeDates).toHaveBeenCalledWith('test');
  });

  it('should not refresh the typeahead cache by default', async () => {
    const spy = jest.spyOn(filterActions, 'refreshTypeaheadCache');
    const thunk = bounceReport.refreshBounceChartMetrics();
    await thunk(dispatchMock, getStateMock);
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should refresh the typeahead cache on date change', async () => {
    const spy = jest.spyOn(filterActions, 'refreshTypeaheadCache');
    const thunk = bounceReport.refreshBounceChartMetrics({ to: 'test', from: 'test' });
    await thunk(dispatchMock, getStateMock);
    expect(spy).toHaveBeenCalled();
  });

  it('should refresh the typeahead cache on relative date change', async () => {
    const spy = jest.spyOn(filterActions, 'refreshTypeaheadCache');
    const thunk = bounceReport.refreshBounceChartMetrics({ from, range: 'hour' });
    await thunk(dispatchMock, getStateMock);
    expect(spy).toHaveBeenCalled();
  });
});
