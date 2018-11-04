import { connect } from 'react-redux';
import { showAlert } from 'src/actions/globalAlert';
import { deleteSnippet } from 'src/actions/snippets';
import DeleteSnippetModal from './DeleteSnippetModal';

const mapStateToProps = (state, props) => ({
  deleting: state.snippets.deletePending,
  error: state.snippets.deleteError
});

const mapDispatchToProps = {
  deleteSnippet,
  showAlert
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSnippetModal);
