import * as actionCreators from '../engagementReport';

it('get chart data', () => {
  const params = { getMetrics: jest.fn((a) => a) };
  expect(actionCreators.getChartData(params)).toMatchSnapshot();
});
