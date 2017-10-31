/* eslint-disable */
import {
  fetchDeliverability,
  getBounceClassifications,
  getBounceReasons
} from 'src/actions/metrics';
import { getQueryFromOptions, getMetricsFromKeys } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';
import { formatCategories, formatArray, formatAggregates } from 'src/helpers/bounce';

export function refresh(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    const bounceMetrics = [
      'count_targeted',
      'count_accepted',
      'count_bounce',
      'bounce_rate',
      'count_admin_bounce',
      'count_block_bounce',
      'count_soft_bounce',
      'count_hard_bounce',
      'count_undetermined_bounce',
      'admin_bounce_rate',
      'block_bounce_rate',
      'soft_bounce_rate',
      'hard_bounce_rate',
      'undetermined_bounce_rate',
      'count_inband_bounce',
      'count_outofband_bounce'
    ];

    updates.metrics = getMetricsFromKeys(bounceMetrics);

    // if relativeRange is included, merge in the calculated from/to values
    if (updates.relativeRange) {
      Object.assign(updates, getRelativeDates(updates.relativeRange) || {});
    }

    // refresh the typeahead cache if the date range has been updated
    // if (from || to) {
      // const params = getQueryFromOptions({ from, to });
      // dispatch(refreshTypeaheadCache(params));
    // }

    const options = {
      // ...state.summaryChart,
      ...state.reportFilters,
      ...updates
    };

    // convert new meta data into query param format
    const aggregateParams = getQueryFromOptions(options);

    // get new data
    return dispatch(fetchDeliverability(aggregateParams))
      .then((aggregates) => {

        if (!aggregates[0].count_bounce) {
          return;
        }

        const bounceParams = { ...aggregateParams, metrics: 'count_bounce' };

        Promise.all([
          dispatch(getBounceClassifications(bounceParams)),
          // dispatch(getBounceReasons(bounceParams)) This is for the table I think
        ]).then((classifications) => {
          console.log(formatCategories(classifications))
          // refresh the chart with the new data
          dispatch({
            type: 'REFRESH_BOUNCE_REPORT',
            payload: {
              categories: formatCategories(classifications),
              aggregates: formatAggregates(aggregates[0])
            }
          });
          //
          // // refresh the date range
          // dispatch({
          //   type: 'REFRESH_REPORT_RANGE',
          //   payload: { ...options }
          // });
        });
      });
  };
}
