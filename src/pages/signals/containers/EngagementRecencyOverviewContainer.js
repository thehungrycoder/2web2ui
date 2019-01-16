import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getEngagementRecency } from 'src/actions/signals';
import { resetSummaryTable } from 'src/actions/summaryTables';
import { defaultFacet, facetsByKey } from '../constants/facets';
import { selectEngagementRecencyOverview } from 'src/selectors/signals';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import EngagementRecencyOverview from '../components/EngagementRecencyOverview';
import withSignalOptions from './withSignalOptions';

const mapStateToProps = (state, props) => {
  const { facet: facetKey } = props.signalOptions;
  const tableName = 'engagementRecencyOverview';

  return {
    ...selectEngagementRecencyOverview(state),
    facet: facetKey ? facetsByKey[facetKey] : defaultFacet,
    summaryTable: selectSummaryTable(state, tableName),
    tableName
  };
};

const mapDispatchToProps = {
  getEngagementRecency,
  resetSummaryTable
};


export default (
  withSignalOptions(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(EngagementRecencyOverview)
    )
  )
);
