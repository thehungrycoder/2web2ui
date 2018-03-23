import { createSelector } from 'reselect';
import moment from 'moment';
import { stringifyTypeaheadfilter } from 'src/helpers/string';
import _ from 'lodash';

const selectDateOptions = (state) => ({
  from: moment(state.reportOptions.from).utc().format(),
  to: moment(state.reportOptions.to).utc().format(),
  range: state.reportOptions.relativeRange
});

const selectTypeaheadFilters = (state) => ({
  filters: _.get(state, 'reportOptions.filters', []).map(stringifyTypeaheadfilter)
});

const selectSummaryMetrics = (state) => ({
  metrics: _.get(state, 'reportOptions.metrics', []).map((metric) => typeof metric === 'string' ? metric : metric.key)
});

/**
 * Converts reportOptions for url sharing
 */
export const selectReportSearchOptions = createSelector(
  [selectDateOptions, selectTypeaheadFilters],
  (dates, filters) => ({ ...dates, ...filters })
);

/**
 * Converts reportOptions for url sharing for the summary chart
 */
export const selectSummaryChartSearchOptions = createSelector(
  [selectDateOptions, selectTypeaheadFilters, selectSummaryMetrics],
  (dates, filters, metrics) => ({ ...dates, ...filters, ...metrics })
);


const selectMessageEventsDateOptions = (state) => ({
  from: moment(_.get(state, 'messageEvents.search.dateOptions.from')).utc().format(),
  to: moment(_.get(state, 'messageEvents.search.dateOptions.to')).utc().format(),
  range: _.get(state, 'messageEvents.search.dateOptions.relativeRange')
});

const selectSearch = (state) => _.omit(state.messageEvents.search, ['dateOptions']);

/**
 * Converts reportOptions for url sharing for message events
 */
export const selectMessageEventsSearchOptions = createSelector(
  [selectMessageEventsDateOptions, selectSearch],
  (dates, search) => ({ ...dates, ...search })
);
