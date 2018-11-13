import { connect } from 'react-redux';
import { getSnippets } from 'src/actions/snippets';
import { hasGrants } from 'src/helpers/conditions';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import ListPage from './ListPage';

const mapStateToProps = (state, props) => ({
  canCreate: hasGrants('templates/modify')(state), // snippet grants are inherited from templates
  error: state.snippets.error,
  hasSubaccounts: hasSubaccounts(state),
  loading: state.snippets.loading,
  snippets: state.snippets.items
});

const mapDispatchToProps = {
  getSnippets
};

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
