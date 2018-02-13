import { createSelector } from 'reselect';

export const selectSummaryReportState = (state) => state.summaryChart;

export const selectSummaryMetrics = createSelector(
  [selectSummaryReportState],
  (state = {}) => state.metrics
);

export const selectSelectedMetrics = createSelector(
  [selectSummaryMetrics],
  (metrics = []) => metrics.map((metric) => metric.key)
);
