import * as bounceReport from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/bounce');
jest.mock('src/helpers/metrics');

Date.now = jest.fn(() => 1487076708000);

describe('Action Creator: Bounce Report', () => {

  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn((a) => Promise.resolve(a));
  });

  it('should dispatch a refresh action', async () => {
    const fetchSpy = jest.spyOn(metricsActions, 'fetchDeliverability');
    metricsActions.fetchDeliverability = jest.fn(() => [{ count_bounce: 1 }]);
    const thunk = bounceReport.refresh();
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
    fetchSpy.mockRestore();
  });
});
