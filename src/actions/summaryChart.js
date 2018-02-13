import { fetch as fetchMetrics } from 'src/actions/metrics';
import { getQueryFromOptions, getMetricsFromKeys } from 'src/helpers/metrics';

export function refreshSummaryReport(updates = {}) {
  return (dispatch, getState) => {
    const { summaryChart } = getState();

    // if new metrics are included, convert them to their full representation from config
    if (updates.metrics) {
      updates = { ...updates, metrics: getMetricsFromKeys(updates.metrics) };
    }

    // merge in existing state
    const merged = {
      ...summaryChart,
      ...updates
    };

    // convert new meta data into query param format
    const params = getQueryFromOptions(merged);

    return Promise.all([
      dispatch(getChartData({ params, metrics: merged.metrics })),
      dispatch(getTableData({ params, metrics: merged.metrics }))
    ]);
  };
}

export function getChartData({ params = {}, metrics }) {
  const options = {
    type: 'FETCH_CHART_DATA',
    path: 'deliverability/time-series',
    params
  };

  return (dispatch, getState) => dispatch(fetchMetrics(options)).then((results) => {
    const payload = {
      data: results,
      precision: params.precision,
      metrics
    };

    dispatch({ type: 'REFRESH_SUMMARY_CHART', payload });
  });
}

export function getTableData({ params, metrics, groupBy }) {
  return (dispatch, getState) => {
    const state = getState();

    // The selected grouping
    const activeGroup = groupBy || state.summaryChart.groupBy;

    // Get selected metrics
    const activeMetrics = metrics || state.summaryChart.metrics;

    // Gets filters and metrics for params
    if (!params) {
      params = getQueryFromOptions({ ...state.summaryChart, ...state.reportFilters });
    }

    const path = activeGroup === 'aggregate' ? 'deliverability' : `deliverability/${activeGroup}`;
    const options = {
      type: 'FETCH_TABLE_DATA',
      path,
      params
    };

    return dispatch(fetchMetrics(options)).then((results) => {
      dispatch({
        type: 'REFRESH_SUMMARY_TABLE',
        payload: {
          data: results,
          groupBy: activeGroup,
          metrics: activeMetrics
        }
      });
    });
  };
}
