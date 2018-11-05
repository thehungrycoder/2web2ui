import _ from 'lodash';
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { updateUser, listUsers, deleteUser } from 'src/actions/users';
import { getAccountSingleSignOnDetails } from 'src/actions/accountSingleSignOn';
import DeleteModal from 'src/components/modals/DeleteModal';
import { Loading } from 'src/components/loading/Loading';
import PageLink from 'src/components/pageLink/PageLink';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { selectUserById } from 'src/selectors/users';
import RoleRadioGroup from './components/RoleRadioGroup';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};

export class EditPage extends Component {
  state = {
    showDelete: false
  };

  toggleDelete = () => this.setState({ showDelete: !this.state.showDelete });

  deleteUser = () => {
    const user = this.props.match.params.id;
    return this.props.deleteUser(user);
  }

  handleUserUpdate = ({ access: access_level, is_sso }) => {
    const { updateUser } = this.props;
    const username = this.props.match.params.id;

    return updateUser(username, { access_level, is_sso });
  }

  componentDidMount() {
    if (_.isEmpty(this.props.accountSingleSignOn)) {
      this.props.getAccountSingleSignOnDetails();
    }

    // only request if user visits page directly
    if (_.isEmpty(this.props.users)) {
      this.props.listUsers();
    }
  }

  render() {
    const {
      currentUser,
      handleSubmit,
      isAccountSingleSignOnEnabled,
      loadingError,
      submitting,
      user,
      users
    } = this.props;

    if (loadingError) {
      return <Redirect to="/account/users" />;
    }

    // Load until we have at least one user
    if (_.isEmpty(users)) {
      return <Loading />;
    }

    if (!user) {
      return <Redirect to="/account/users" />;
    }

    const secondaryActions = [];

    if (!user.isCurrentUser) {
      secondaryActions.push({
        content: 'Delete',
        onClick: this.toggleDelete
      });
    }

    const ssoHelpText = isAccountSingleSignOnEnabled
      ? <span>Enabling single sign-on will delete this user's password. If they switch back to password-based authentication, they'll need to reset their password on login.</span>
      : <span>Single sign-on has not been configured for your account. Enable in your <PageLink to="/account/settings">account's settings</PageLink>.</span>;

    return (
      <Page
        title={user.email}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={secondaryActions}>
        <Panel>
          <form onSubmit={handleSubmit(this.handleUserUpdate)}>
            <Panel.Section>
              <Field
                name="access"
                disabled={user.isCurrentUser}
                allowSuperUser={currentUser.access === 'superuser'}
                component={RoleRadioGroup}
              />
            </Panel.Section>
            <Panel.Section>
              <Field
                component={CheckboxWrapper}
                disabled={!isAccountSingleSignOnEnabled}
                helpText={ssoHelpText}
                label='Enable single sign-on authentication for this user'
                name='is_sso'
                type="checkbox"
              />
            </Panel.Section>
            <Panel.Section>
              <Button primary disabled={submitting} submit>{'Update user'}</Button>
            </Panel.Section>
          </form>
        </Panel>
        <DeleteModal
          onDelete={this.deleteUser}
          onCancel={this.toggleDelete}
          open={this.state.showDelete}
          content={<p><span>User "</span><span>{this.props.match.params.id}</span><span>" will no longer be able to log in or access this SparkPost account. All API keys associated with this user will be transferred to you.</span></p>}
          title="Are you sure you want to delete this user?"
        />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const user = selectUserById(state, props.match.params.id);

  return {
    accountSingleSignOn: state.accountSingleSignOn,
    currentUser: state.currentUser,
    isAccountSingleSignOnEnabled: state.accountSingleSignOn.enabled,
    loadingError: state.users.error,
    user,
    users: state.users.entities,
    initialValues: {
      access: _.get(user, 'access'),
      is_sso: _.get(user, 'is_sso')
    }
  };
};

const mapDispatchToProps = { updateUser, listUsers, deleteUser, getAccountSingleSignOnDetails };
const formOptions = { form: 'userEditForm', enableReinitialize: true };

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(EditPage));
