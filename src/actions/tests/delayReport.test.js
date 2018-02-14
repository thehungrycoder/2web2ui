import { refreshDelayReport } from '../delayReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');

describe('Action Creator: Refresh Delay Report', () => {

  let dispatchMock;
  let queryMock;
  let updates;
  let result;

  beforeEach(() => {
    queryMock = {};
    updates = { abc: 'cool' };
    metricsHelpers.getQueryFromOptions = jest.fn(() => queryMock);
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    result = refreshDelayReport(updates)(dispatchMock);
  });

  it('should return a promise', () => {
    expect(result).toBeInstanceOf(Promise);
  });

  it('should get query options, passing in updates', () => {
    expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith(updates);
  });

  it('should dispatch actions', () => {
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(metricsActions.fetchDeliverability).toHaveBeenCalledWith({
      type: 'GET_DELAY_REPORT_AGGREGATES',
      params: {
        ...queryMock,
        metrics: 'count_accepted,count_delayed,count_delayed_first'
      }
    });
    expect(metricsActions.fetchDelayReasonsByDomain).toHaveBeenCalledWith(queryMock);
  });

});
