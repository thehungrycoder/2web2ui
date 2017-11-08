import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';
import * as dateHelpers from 'src/helpers/date';
import * as filterActions from 'src/actions/reportFilters';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');

Date.now = jest.fn(() => 1487076708000);

describe('Action Creator: Bounce Report', () => {

  let dispatchMock;
  let getStateMock;
  let fetchSpy;

  beforeEach(() => {
    fetchSpy = jest.spyOn(metricsActions, 'fetchDeliverability');
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('should dispatch a refresh action', async () => {
    const thunk = bounceReport.refresh();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should handle relative range', async () => {
    const spy = jest.spyOn(dateHelpers, 'getRelativeDates');
    const thunk = bounceReport.refresh({ relativeRange: 'test' });
    await thunk(dispatchMock, getStateMock);
    expect(spy).toHaveBeenCalledWith('test');
  });

  it('should handle date updates', async () => {
    const spy = jest.spyOn(filterActions, 'refreshTypeaheadCache');
    const thunk = bounceReport.refresh({ to: 'test', from: 'test' });
    await thunk(dispatchMock, getStateMock);
    expect(spy).toHaveBeenCalled();
  });
});
