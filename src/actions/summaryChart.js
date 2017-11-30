/* eslint-disable */
import { fetch as fetchMetrics } from 'src/actions/metrics';
import { refreshTypeaheadCache, refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, getMetricsFromKeys } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';

export function refresh(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    // if new metrics are included, convert them to their full representation from config
    if (updates.metrics) {
      updates.metrics = getMetricsFromKeys(updates.metrics);
    }

    // if relativeRange is included, merge in the calculated from/to values
    if (updates.relativeRange) {
      Object.assign(updates, getRelativeDates(updates.relativeRange) || {});
    }

    // refresh the typeahead cache if the date range has been updated
    const { from, to } = updates;
    if (from || to) {
      const params = getQueryFromOptions({ from, to });
      dispatch(refreshTypeaheadCache(params));
    }

    // merge in existing state
    const options = {
      ...state.summaryChart,
      ...state.reportFilters,
      ...updates
    };

    dispatch(refreshReportRange(options));

    // convert new meta data into query param format
    const params = getQueryFromOptions(options);

    return Promise.all([
      dispatch(getChartData({ params, metrics: options.metrics })),
      dispatch(getTableData({ params, metrics: options.metrics }))
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
    const activeGroup = groupBy || state.summaryChart.groupBy;

    if (!metrics) {
      metrics = state.summaryChart.metrics;
    }

    if (!params) {
      params = getQueryFromOptions({ ...state.summaryChart, ...state.reportFilters });
    }

    const options = {
      type: 'FETCH_TABLE_DATA',
      path: `deliverability/${activeGroup}`,
      params
    };

    dispatch(fetchMetrics(options)).then((results) => {
      dispatch({
        type: 'REFRESH_SUMMARY_TABLE',
        payload: {
          data: results,
          groupBy: activeGroup,
          metrics
        }
      });
    });
  }
}
