import * as summaryChart from '../summaryChart';
import * as metricsActions from 'src/actions/metrics';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Summary Chart', () => {
  Date.now = jest.fn(() => 1487076708000);

  let dispatchMock;
  let getStateMock;

  beforeEach(() => {
    const state = {
      summaryChart: {
        groupBy: 'domain',
        metrics: ['count_accepted']
      }
    };

    metricsActions.fetch = jest.fn((a) => Promise.resolve(a));
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    getStateMock = jest.fn(() => state);
  });

  it('should dispatch a refresh action', async() => {
    const updates = {
      relativeRange: 'new range',
      from: Date.now(),
      to: Date.now(),
      metrics: ['count_targeted']
    };
    const thunk = summaryChart.refresh(updates);
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch a get chart data', async() => {
    const thunk = summaryChart.getChartData({});
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch a get table data action', async() => {
    const thunk = summaryChart.getTableData({});
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should use the correct path for aggregate group', async() => {
    const state = {
      summaryChart: {
        groupBy: 'aggregate',
        metrics: ['count_accepted']
      }
    };

    getStateMock = jest.fn(() => state);
    const thunk = summaryChart.getTableData({});
    await thunk(dispatchMock, getStateMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });
});
