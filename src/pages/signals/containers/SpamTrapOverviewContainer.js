import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals.fake';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { defaultFacet, facetsByKey } from '../constants/facets';
import { selectSpamHitsOverview } from 'src/selectors/signals';
import { selectSubaccountsById } from 'src/selectors/subaccounts';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import SpamTrapOverview from '../components/SpamTrapOverview';
import withSignalOptions from './withSignalOptions';

const mapStateToProps = (state, props) => {
  const { facet: facetKey, relativeRange } = props.signalOptions;
  const tableName = 'spamTrapHitsOverview';

  return {
    ...selectSpamHitsOverview(state, { relativeRange }),
    facet: facetKey ? facetsByKey[facetKey] : defaultFacet,
    subaccounts: selectSubaccountsById(state),
    summaryTable: selectSummaryTable(state, tableName),
    tableName
  };
};

const mapDispatchToProps = {
  getSpamHits,
  getSubaccounts
};


export default (
  withSignalOptions(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(SpamTrapOverview)
    )
  )
);
