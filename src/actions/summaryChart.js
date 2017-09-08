import { fetch as fetchMetrics } from 'actions/metrics';
import { refreshTypeaheadCache } from 'actions/reportFilters';
import { getQueryFromOptions, getMetricsFromKeys } from 'helpers/metrics';
import { getRelativeDates } from 'helpers/date';

export function refresh(options = {}) {
  return (dispatch, getState) => {
    const state = getState();

    // if new metrics are included, convert them to their full representation from config
    if (options.metrics) {
      options.metrics = getMetricsFromKeys(options.metrics);
    }

    // if relativeRange is included, merge in the calculated from/to values
    Object.assign(options, getRelativeDates(options.relativeRange) || {});

    // merge in existing state
    options = {
      ...state.summaryChart,
      ...state.reportFilters,
      ...options
    };

    // convert new meta data into query param format
    const params = getQueryFromOptions(options);

    const onSuccess = (results) => {
      dispatch({
        type: 'REFRESH_SUMMARY_CHART',
        payload: {
          data: results,
          metrics: options.metrics,
          precision: params.precision
        }
      });

      dispatch({
        type: 'REFRESH_REPORT_FILTERS',
        payload: { ...options }
      });
    };

    const { from, to } = options;
    if (from || to) {
      const params = getQueryFromOptions({ from, to });
      dispatch(refreshTypeaheadCache(params));
    }

    dispatch(fetchMetrics({ path: 'deliverability/time-series', params })).then(onSuccess);
  };
}
