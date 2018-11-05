import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { clearSnippet, createSnippet, getSnippet } from 'src/actions/snippets';
import { hasSubaccounts, selectSubaccountFromId } from 'src/selectors/subaccounts';
import CreatePage from './CreatePage';

const formOptions = {
  form: 'createSnippetForm',
  enableReinitialize: true
};

const mapDispatchToProps = {
  clearSnippet,
  createSnippet,
  getSnippet
};

const mapStateToProps = (state, props) => {
  const { id, subaccountId } = props.location.state;

  if (id) { // for duplicating
    const snippet = state.snippets.item || {};
    const assignTo = subaccountId
      ? 'subaccount'
      : snippet.shared_with_subaccounts ? 'shared' : 'master';

    return {
      hasSubaccounts: hasSubaccounts(state),
      initialValues: {
        ...snippet,
        assignTo,
        id: `${snippet.id}-copy`,
        name: `${snippet.name} Copy`,
        subaccount: selectSubaccountFromId(state, subaccountId)
      },
      loading: state.snippets.getPending,
      snippetToDuplicate: {
        id,
        subaccountId
      }
    };
  }

  return {
    hasSubaccounts: hasSubaccounts(state),
    initialValues: {
      assignTo: 'master'
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(CreatePage));
