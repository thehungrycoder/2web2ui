import { fetchDeliverability, fetchBounceClassifications } from 'src/actions/metrics';
import { refreshTypeaheadCache, refreshReportRage } from 'src/actions/reportFilters';
import { getQueryFromOptions, getMetricsFromKeys } from 'src/helpers/metrics';
import { getRelativeDates } from 'src/helpers/date';
import { getBandTypes, reshapeCategories, formatAggregates } from 'src/helpers/bounce';
import _ from 'lodash';

export function refresh(updates = {}) {
  return (dispatch, getState) => {
    const state = getState();

    const bounceMetrics = [
      'count_targeted',
      'count_bounce',
      'count_inband_bounce',
      'count_outofband_bounce'
    ];

    updates.metrics = getMetricsFromKeys(bounceMetrics);

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

    const options = {
      ...state.reportFilters,
      ...updates
    };

    // convert new meta data into query param format
    const aggregateParams = _.omit(getQueryFromOptions(options), 'precision');

    // get new data
    return dispatch(fetchDeliverability(aggregateParams))
      .then((aggregates) => {

        if (!aggregates[0].count_bounce) {
          return;
        }

        const bounceParams = { ...aggregateParams, metrics: 'count_bounce' };

        // dispatch(getBounceReasons(bounceParams)) For table data
        dispatch(fetchBounceClassifications(bounceParams)).then((classifications) => {
          dispatch(refreshBounceReport({ aggregates, classifications }));
          dispatch(refreshReportRage(options));
        });
      });
  };
}

// refresh the chart with the new data
export function refreshBounceReport({ aggregates, classifications }) {
  const formattedAggregates = formatAggregates(aggregates[0]);
  return {
    type: 'REFRESH_BOUNCE_REPORT',
    payload: {
      categories: reshapeCategories(classifications),
      aggregates: formattedAggregates,
      types: getBandTypes(formattedAggregates)
    }
  };
}
