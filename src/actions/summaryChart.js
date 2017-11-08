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

    // get new data
    return dispatch(fetchMetrics({ path: 'deliverability/time-series', params })).then((results) => {

      const summaryData = {
        data: results,
        metrics: options.metrics,
        precision: params.precision
      };

      // refresh the chart with the new data
      dispatch(refreshSummaryChart(summaryData));
    });
  };
}

export function refreshSummaryChart(payload) {
  return {
    type: 'REFRESH_SUMMARY_CHART',
    payload
  };
}
