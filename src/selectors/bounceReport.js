import { createSelector, createStructuredSelector } from 'reselect';
import { getBandTypes, reshapeCategories, formatAggregates } from 'src/helpers/bounce';

const selectChartLoading = ({ bounceReport }) => bounceReport.aggregatesLoading || bounceReport.categoriesLoading;
const selectReasonsLoading = ({ bounceReport }) => bounceReport.reasonsLoading;
const selectTableLoading = createSelector(
  [selectChartLoading, selectReasonsLoading],
  (chartLoading, reasonsLoading) => chartLoading || reasonsLoading
);
const selectReasons = ({ bounceReport }) => bounceReport.reasons;

const selectFormattedAggregates = ({ bounceReport }) => {
  const { aggregates = []} = bounceReport;
  return formatAggregates(aggregates[0]);
};

const selectReshapedClassifications = ({ bounceReport }) => {
  const { classifications = []} = bounceReport;
  return reshapeCategories(classifications);
};

const selectBandTypes = createSelector(
  [selectFormattedAggregates],
  (formattedAggregates) => getBandTypes(formattedAggregates)
);

// TODO: decide if these should live in selectors or in eventual containers
export const mapStateToProps = createStructuredSelector({
  chartLoading: selectChartLoading,
  tableLoading: selectTableLoading,
  reasons: selectReasons,
  aggregates: selectFormattedAggregates,
  categories: selectReshapedClassifications,
  types: selectBandTypes
});
