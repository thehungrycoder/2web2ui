import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getHealthScore } from 'src/actions/signals';
import { resetSummaryTable } from 'src/actions/summaryTables';
import { defaultFacet, facetsByKey } from '../constants/facets';
import { selectHealthScoreOverview } from 'src/selectors/signals';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import HealthScoreOverview from '../components/HealthScoreOverview';
import withSignalOptions from './withSignalOptions';

const mapStateToProps = (state, props) => {
  const { facet: facetKey } = props.signalOptions;
  const tableName = 'healthScoreOverview';

  return {
    ...selectHealthScoreOverview(state),
    facet: facetKey ? facetsByKey[facetKey] : defaultFacet,
    summaryTable: selectSummaryTable(state, tableName),
    tableName
  };
};

const mapDispatchToProps = {
  getHealthScore,
  resetSummaryTable
};


export default (
  withSignalOptions(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(HealthScoreOverview)
    )
  )
);
