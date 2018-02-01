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
  const thunk = actionCreators.getAggregateMetrics({ getMetrics: jest.fn((a) => a) });

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
  const thunk = actionCreators.getLinkMetrics({ getMetrics: jest.fn((a) => a) });

  expect(thunk(mockDispatch, mockGetState)).toMatchSnapshot();
});
