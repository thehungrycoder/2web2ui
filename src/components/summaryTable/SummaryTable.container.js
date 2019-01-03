import { connect } from 'react-redux';
import * as summaryTableActions from 'src/actions/summaryTables';
import { selectSummaryTable } from 'src/selectors/summaryTables';
import SummaryTable from './SummaryTable';

const mapStateToProps = (state, props) => selectSummaryTable(state, props.tableName);

export default connect(mapStateToProps, summaryTableActions)(SummaryTable);
