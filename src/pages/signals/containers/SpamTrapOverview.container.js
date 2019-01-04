import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getSpamHits } from 'src/actions/signals';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { defaultFacet, facetsByKey } from 'src/config/facets';
import {
  getSpamHitsData,
  selectSpamHitsOverviewData,
  selectSpamHitsOverviewMetaData
} from 'src/selectors/signals';
import { selectSubaccountsById } from 'src/selectors/subaccounts';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import SpamTrapOverview from '../components/SpamTrapOverview';
import withSignalOptions from '../components/withSignalOptions';

const mapStateToProps = (state, props) => {
  const { facet: facetKey, relativeRange } = props.signalOptions;
  const tableName = 'spamTrapHitsOverview';

  return {
    ...getSpamHitsData(state),
    data: selectSpamHitsOverviewData(state, { relativeRange }),
    facet: facetKey ? facetsByKey[facetKey] : defaultFacet,
    metaData: selectSpamHitsOverviewMetaData(state),
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
