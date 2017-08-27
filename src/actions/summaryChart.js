import { fetch as fetchMetrics } from 'actions/metrics';
import { getQueryFromOptions, getMetricsFromList, getRelativeDates } from 'helpers/metrics';

export function refresh(options = {}, { clear } = {}) {
  return (dispatch, getState) => {
    const state = getState();

    // if new metrics are includedd, convert them to their full representation from config
    if (options.metrics) {
      options.metrics = getMetricsFromList(options.metrics);
    }

    // if relativeRange is included, merge in the calculated from/to values
    Object.assign(options, getRelativeDates(options.relativeRange) || {});

    // if clear is true, just use options, otherwise merge in existing state
    const meta = clear ? options : {
      ...state.summaryChart,
      ...state.reportFilters,
      ...options
    };

    // convert new meta data into query param format
    const params = getQueryFromOptions(meta);

    // attach precision and range to passed through meta
    meta.precision = params.precision;
    meta.range = options.relativeRange;

    dispatch(fetchMetrics({ path: 'deliverability/time-series', params, meta }));
  };
}
