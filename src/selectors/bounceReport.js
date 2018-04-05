import { createSelector, createStructuredSelector } from 'reselect';
import { getBandTypes, reshapeCategories, formatAggregates } from 'src/helpers/bounce';
import { selectReportSearchOptions } from './reportSearchOptions';
import _ from 'lodash';

const selectReportOptions = (state) => state.reportOptions;
const selectChartLoading = ({ bounceReport }) => bounceReport.aggregatesLoading || bounceReport.categoriesLoading;
const selectReasonsLoading = ({ bounceReport }) => bounceReport.reasonsLoading;
const selectTableLoading = createSelector(
  [selectChartLoading, selectReasonsLoading],
  (chartLoading, reasonsLoading) => chartLoading || reasonsLoading
);
const selectAggregates = ({ bounceReport }) => bounceReport.aggregates;
const selectClassifications = (state) => _.get(state, 'bounceReport.classifications', []);
const selectReasons = ({ bounceReport }) => bounceReport.reasons;

const selectFormattedAggregates = createSelector(
  [selectAggregates],
  (aggregates) => {
    if (!aggregates.count_bounce) {
      return [];
    }
    return formatAggregates(aggregates);
  }
);

const selectReshapedClassifications = createSelector(
  [selectClassifications],
  (classifications) => reshapeCategories(classifications)
);

const selectCategories = createSelector(
  [selectReshapedClassifications],
  (classifications) => _.filter(classifications, ({ name }) => name !== 'Admin')
);

const selectAdminBounces = createSelector(
  [selectReshapedClassifications],
  (classifications) => {
    const adminBounces = _.filter(classifications, ({ name }) => name === 'Admin')[0];
    return adminBounces ? adminBounces.count : 0;
  }
);

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
  categories: selectCategories,
  adminBounces: selectAdminBounces,
  types: selectBandTypes,
  reportOptions: selectReportOptions,
  bounceSearchOptions: selectReportSearchOptions
});
