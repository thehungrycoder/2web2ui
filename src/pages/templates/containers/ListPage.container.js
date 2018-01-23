import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { listTemplates } from 'src/actions/templates';
import { selectTemplates } from 'src/selectors/templates';
import { hasSubaccounts } from 'src/selectors/subaccounts';

import ListPage from '../ListPage';

function mapStateToProps(state) {
  const templates = selectTemplates(state);
  return {
    count: templates.length,
    templates,
    hasSubaccounts: hasSubaccounts(state),
    loading: state.templates.listLoading,
    error: state.templates.listError
  };
}

export default withRouter(connect(mapStateToProps, { listTemplates })(ListPage));
