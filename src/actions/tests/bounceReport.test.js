import { refreshBounceReport } from '../bounceReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');

describe('Action Creator: Refresh Bounce Report', () => {

  let dispatchMock;
  let queryMock;
  let updates;
  let result;

  beforeEach(() => {
    queryMock = {};
    updates = { abc: 'cool' };
    metricsHelpers.getQueryFromOptions = jest.fn(() => queryMock);
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    result = refreshBounceReport(updates)(dispatchMock);
  });

  it('should return a promise', () => {
    expect(result).toBeInstanceOf(Promise);
  });

  it('should get query options, passing in updates', () => {
    expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith(updates);
  });

  it('should dispatch actions', () => {
    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(metricsActions.fetchDeliverability).toHaveBeenCalledWith({
      type: 'GET_BOUNCE_REPORT_AGGREGATES',
      params: {
        ...queryMock,
        metrics: 'count_sent,count_bounce,count_inband_bounce,count_outofband_bounce,count_admin_bounce'
      }
    });
    expect(metricsActions.fetchBounceClassifications).toHaveBeenCalledWith({
      ...queryMock,
      metrics: 'count_bounce,count_admin_bounce'
    });
    expect(metricsActions.fetchBounceReasonsByDomain).toHaveBeenCalledWith({
      ...queryMock,
      metrics: 'count_bounce,count_admin_bounce'
    });
  });

});
