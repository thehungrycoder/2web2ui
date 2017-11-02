/* eslint-disable */
import {
  fetchDeliverability,
  getBounceClassifications,
  getBounceReasons
} from 'src/actions/metrics';
import { getQueryFromOptions, getMetricsFromKeys, computeKeysForItem } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';
import { getBandTypes, reshapeCategories, formatAggregates } from 'src/helpers/bounce';

export function refresh(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    const bounceMetrics = [
      'count_targeted',
      // 'count_accepted',
      'count_bounce',
      'bounce_rate',
      // 'count_admin_bounce',
      // 'count_block_bounce',
      // 'count_soft_bounce',
      // 'count_hard_bounce',
      // 'count_undetermined_bounce',
      // 'admin_bounce_rate',
      // 'block_bounce_rate',
      // 'soft_bounce_rate',
      // 'hard_bounce_rate',
      // 'undetermined_bounce_rate',
      'count_inband_bounce',
      'count_outofband_bounce'
    ];

    updates.metrics = getMetricsFromKeys(bounceMetrics);

    // if relativeRange is included, merge in the calculated from/to values
    if (updates.relativeRange) {
      Object.assign(updates, getRelativeDates(updates.relativeRange) || {});
    }

    const options = {
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

          const formattedAggregates = formatAggregates(aggregates[0]);

          // refresh the chart with the new data
          dispatch({
            type: 'REFRESH_BOUNCE_REPORT',
            payload: {
              categories: reshapeCategories(classifications),
              aggregates: formattedAggregates,
              types: getBandTypes(formattedAggregates)
            }
          });

          // // refresh the date range
          // dispatch({
          //   type: 'REFRESH_REPORT_RANGE',
          //   payload: { ...options }
          // });
        });
      });
  };
}
