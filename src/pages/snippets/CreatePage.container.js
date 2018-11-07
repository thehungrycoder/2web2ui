import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { clearSnippet, createSnippet, getSnippet } from 'src/actions/snippets';
import assignedTo from 'src/helpers/assignedTo';
import { duplicate } from 'src/helpers/snippets';
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

export const mapStateToProps = (state, props) => {
  const { id, subaccountId } = props.location.state || {};

  if (id) { // for duplicating
    const snippet = state.snippets.item || {};
    const duplicateSnippet = duplicate({ ...snippet, subaccount_id: subaccountId });

    return {
      hasSubaccounts: hasSubaccounts(state),
      initialValues: {
        ...duplicateSnippet,
        assignTo: assignedTo(duplicateSnippet),
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
