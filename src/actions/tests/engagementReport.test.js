import { refreshEngagementReport } from '../engagementReport';
import * as metricsActions from 'src/actions/metrics';
import * as metricsHelpers from 'src/helpers/metrics';

jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');

describe('Action Creator: Refresh Engagement Report', () => {

  let dispatchMock;
  let queryMock;
  let updates;
  let result;

  beforeEach(() => {
    queryMock = {};
    updates = { abc: 'cool' };
    metricsHelpers.getQueryFromOptions = jest.fn(() => queryMock);
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    result = refreshEngagementReport(updates)(dispatchMock);
  });

  it('should return a promise', () => {
    expect(result).toBeInstanceOf(Promise);
  });

  it('should get query options, passing in updates', () => {
    expect(metricsHelpers.getQueryFromOptions).toHaveBeenCalledWith(updates);
  });

  it('should dispatch actions', () => {
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    expect(metricsActions.fetch).toHaveBeenCalledWith({
      params: {
        ...queryMock,
        metrics: 'count_accepted,count_targeted,count_unique_clicked_approx,count_unique_confirmed_opened_approx'
      },
      path: 'deliverability',
      type: 'GET_ENGAGEMENT_AGGREGATE_METRICS'
    });
    expect(metricsActions.fetch).toHaveBeenCalledWith({
      params: {
        ...queryMock,
        metrics: 'count_clicked,count_raw_clicked_approx'
      },
      path: 'deliverability/link-name',
      type: 'GET_ENGAGEMENT_LINK_METRICS'
    });
  });

});
