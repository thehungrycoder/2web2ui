import * as actionCreators from '../engagementReport';
import time from 'src/__testHelpers__/time';

it('params to get engagement chart data', () => {
  const mockDispatch = jest.fn((a) => a);
  const mockGetState = jest.fn(() => ({
    reportFilters: {
      from: time({ day: 1 }),
      relativeRange: 'day',
      to: time({ day: 2 })
    }
  }));
  const thunk = actionCreators.getChartData({ getMetrics: jest.fn((a) => a) });

  expect(thunk(mockDispatch, mockGetState)).toMatchSnapshot();
});

it('params to get engagement table data', () => {
  const mockDispatch = jest.fn((a) => a);
  const mockGetState = jest.fn(() => ({
    reportFilters: {
      from: time({ day: 1 }),
      relativeRange: 'day',
      to: time({ day: 2 })
    }
  }));
  const thunk = actionCreators.getTableData({ getMetrics: jest.fn((a) => a) });

  expect(thunk(mockDispatch, mockGetState)).toMatchSnapshot();
});
