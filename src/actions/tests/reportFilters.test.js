import * as reportFilters from '../reportFilters';
import * as metrics from 'src/actions/metrics';
import { listTemplates } from 'src/actions/templates';
import { list as listSubaccounts } from 'src/actions/subaccounts';
import { list as listSendingDomains } from 'src/actions/sendingDomains';

jest.mock('src/helpers/metrics');
jest.mock('src/actions/metrics');
jest.mock('src/actions/templates');
jest.mock('src/actions/subaccounts');
jest.mock('src/actions/sendingDomains');


describe('Action Creator: Report Filters', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    jest.resetAllMocks();
  });

  it('should call all requests on refresh', async() => {
    const thunk = reportFilters.refreshTypeaheadCache({ foo: 'bar' });
    await thunk(dispatchMock);
    expect(metrics.fetchMetricsDomains).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsCampaigns).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsSendingIps).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsIpPools).toHaveBeenCalledTimes(1);
    expect(listTemplates).toHaveBeenCalledTimes(1);
    expect(listSubaccounts).toHaveBeenCalledTimes(1);
    expect(listSendingDomains).toHaveBeenCalledTimes(1);

  });

  it('should only call the metrics calls on refresh', async() => {
    const thunk = reportFilters.refreshTypeaheadCache({ foo: 'bar' }, true);
    await thunk(dispatchMock);
    expect(metrics.fetchMetricsDomains).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsCampaigns).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsSendingIps).toHaveBeenCalledTimes(1);
    expect(metrics.fetchMetricsIpPools).toHaveBeenCalledTimes(1);
    expect(listTemplates).toHaveBeenCalledTimes(0);
    expect(listSubaccounts).toHaveBeenCalledTimes(0);
    expect(listSendingDomains).toHaveBeenCalledTimes(0);
  });

  it('should not refresh the typeahead cache by default', () => {
    reportFilters.maybeRefreshTypeaheadCache(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(0);
  });

  it('should refresh the typeahead cache on from date change', async() => {
    await reportFilters.maybeRefreshTypeaheadCache(dispatchMock, { to: 'test', from: 'test' }, { from: 'foo' });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('should refresh the typeahead cache on to date change', async() => {
    await reportFilters.maybeRefreshTypeaheadCache(dispatchMock, { to: 'test', from: 'test' }, { to: 'to' });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

  it('should refresh the typeahead cache on relative date change', async() => {
    reportFilters.maybeRefreshTypeaheadCache(dispatchMock, { to: 'test', from: 'test' }, { relativeRange: '24hrs' });
    expect(dispatchMock).toHaveBeenCalledTimes(1);
  });

});
