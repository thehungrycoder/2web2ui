import { connect } from 'react-redux';
import { getSnippets, deleteSnippet } from 'src/actions/snippets';
import { showAlert } from 'src/actions/globalAlert';
import { hasGrants } from 'src/helpers/conditions';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import ListPage from './ListPage';

const mapStateToProps = (state, props) => ({
  canCreate: hasGrants('templates/modify')(state), // snippet grants are inherited from templates
  error: state.snippets.error,
  hasSubaccounts: hasSubaccounts(state),
  loading: state.snippets.loading,
  deletePending: state.snippets.deletePending,
  snippets: state.snippets.items
});

const mapDispatchToProps = {
  getSnippets,
  deleteSnippet,
  showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
