import { connect } from 'react-redux';
import { getSnippets } from 'src/actions/snippets';
import ImportSnippetPanel from './ImportSnippetPanel';

const mapDispatchToProps = {
  getSnippets
};

const mapStateToProps = (state, props) => ({
  loading: state.snippets.loading,
  snippets: state.snippets.items
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportSnippetPanel);
