import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import { resetSummaryTable } from 'src/actions/summaryTables';
import { defaultFacet, facetsByKey } from '../constants/facets';
import { selectSpamHitsOverview } from 'src/selectors/signals';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import SpamTrapOverview from '../components/SpamTrapOverview';
import withSignalOptions from './withSignalOptions';

const mapStateToProps = (state, props) => {
  const { facet: facetKey } = props.signalOptions;
  const tableName = 'spamTrapHitsOverview';

  return {
    ...selectSpamHitsOverview(state),
    facet: facetKey ? facetsByKey[facetKey] : defaultFacet,
    summaryTable: selectSummaryTable(state, tableName),
    tableName
  };
};

const mapDispatchToProps = {
  getSpamHits,
  resetSummaryTable
};


export default (
  withSignalOptions(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(SpamTrapOverview)
    )
  )
);
