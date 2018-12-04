import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { updateUser, listUsers, deleteUser } from 'src/actions/users';
import { getAccountSingleSignOnDetails } from 'src/actions/accountSingleSignOn';
import { selectUserById } from 'src/selectors/users';
import { FORMS } from 'src/constants';

import EditPage from './EditPage';

const mapStateToProps = (state, props) => {
  const user = selectUserById(state, props.match.params.id);

  return {
    accountSingleSignOn: state.accountSingleSignOn,
    currentUser: state.currentUser,
    isAccountSingleSignOnEnabled: state.accountSingleSignOn.enabled,
    loadingError: state.users.error,
    user,
    users: state.users.entities,
    updatePending: state.users.updatePending,
    tfaRequired: state.account.tfa_required,
    initialValues: {
      access: _.get(user, 'access'),
      is_sso: _.get(user, 'is_sso')
    }
  };
};

const mapDispatchToProps = { updateUser, listUsers, deleteUser, getAccountSingleSignOnDetails };
const formOptions = { form: FORMS.EDIT_USER, enableReinitialize: true };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm(formOptions)(EditPage));
