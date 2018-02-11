import { fetchDeliverability, fetchBounceClassifications, fetchBounceReasonsByDomain } from 'src/actions/metrics';
import { refreshReportRange } from 'src/actions/reportFilters';
import { getQueryFromOptions, buildCommonOptions, getMetricsFromKeys } from 'src/helpers/metrics';

const BOUNCE_AGG_METRICS = getMetricsFromKeys([
  'count_targeted',
  'count_bounce',
  'count_inband_bounce',
  'count_outofband_bounce'
]);

const BOUNCE_METRICS = getMetricsFromKeys([
  'count_bounce'
]);

export function refreshBounceReport(updates = {}) {
  return (dispatch, getState) => {
    const options = buildCommonOptions(getState().reportFilters, updates);
    dispatch(refreshReportRange(options));

    const aggregateParams = getQueryFromOptions({ ...options, metrics: BOUNCE_AGG_METRICS });
    delete aggregateParams.precision;

    const bounceParams = getQueryFromOptions({ ...options, metrics: BOUNCE_METRICS });
    delete bounceParams.precision;

    // get new data
    return Promise.all([
      dispatch(fetchDeliverability({
        type: 'GET_BOUNCE_REPORT_AGGREGATES',
        params: aggregateParams
      })),
      dispatch(fetchBounceClassifications(bounceParams)),
      dispatch(fetchBounceReasonsByDomain(bounceParams))
    ]);
  };
}


//     .then((aggregates) => {
//       if (!aggregates[0].count_bounce) {
//         return;
//       }

//       dispatch(fetchBounceClassifications(bounceParams))
//         .then((classifications) => dispatch(refreshBounceChart({ aggregates, classifications })));
//     });
// };





// // Refresh the chart with the new data
// export function refreshBounceChart({ aggregates, classifications }) {
//   const formattedAggregates = formatAggregates(aggregates[0]);
//   return {
//     type: 'REFRESH_BOUNCE_CHART',
//     payload: {
//       categories: reshapeCategories(classifications),
//       aggregates: formattedAggregates,
//       types: getBandTypes(formattedAggregates)
//     }
//   };
// }

// // Load new metrics for the bounce reasons table
// // Dispatches refreshBounceTable() on completion.
// export function refreshBounceTableMetrics(updates = {}) {
//   return (dispatch, getState) => {
//     const state = getState();
//     const options = buildCommonOptions(state.reportFilters, updates);
//     const query = getQueryFromOptions(options);
//     const baseParams = _.omit(query, 'precision');
//     const params = { ...baseParams, metrics: 'count_bounce' };

//     return dispatch(fetchBounceReasonsByDomain(params))
//       .then((reasons) => {
//         dispatch(refreshBounceTable({ reasons }));
//       });
//   };
// }

// // Refhres the table with the new data
// export function refreshBounceTable({ reasons }) {
//   return {
//     type: 'REFRESH_BOUNCE_TABLE',
//     payload: { reasons }
//   };
// }
