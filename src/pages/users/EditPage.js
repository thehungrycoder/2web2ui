import React, { Component } from 'react';
import _ from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import { Page } from '@sparkpost/matchbox';
import DeleteModal from 'src/components/modals/DeleteModal';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';
import { Loading } from 'src/components/loading/Loading';
import EditForm from './components/EditForm';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};

export class EditPage extends Component {
  state = {
    showDelete: false,
    showDisableTfa: false
  };

  toggleDelete = () => this.setState({ showDelete: !this.state.showDelete });

  deleteUser = () => {
    const user = this.props.match.params.id;
    return this.props.deleteUser(user);
  };

  handleUserUpdate = ({ access: access_level, is_sso }) => {
    const { updateUser, user } = this.props;
    const username = this.props.match.params.id;

    return updateUser(username, { access_level, is_sso, tfa_enabled: user.tfa_enabled });
  };

  toggleTfaModal = () => this.setState({ showDisableTfa: !this.state.showDisableTfa });

  handleDisableTfa = () => {
    const { user, updateUser } = this.props;
    const username = this.props.match.params.id;
    return updateUser(username, {
      access_level: user.access,
      is_sso: user.is_sso,
      tfa_enabled: false
    }).then(this.toggleTfaModal);
  };

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
      updatePending,
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

      if (user.tfa_enabled) {
        secondaryActions.push({
          content: 'Disable Two-Factor Authentication',
          onClick: this.toggleTfaModal
        });
      }
    }

    return (
      <Page
        title={user.email}
        breadcrumbAction={breadcrumbAction}
        secondaryActions={secondaryActions}
      >
        <EditForm
          onSubmit={() => handleSubmit(this.handleUserUpdate)}
          user={user}
          currentUser={currentUser}
          isAccountSingleSignOnEnabled={isAccountSingleSignOnEnabled}
          submitting={submitting}
        />

        <DeleteModal
          onDelete={this.deleteUser}
          onCancel={this.toggleDelete}
          open={this.state.showDelete}
          content={
            <p>
              <span>User "</span>
              <span>{this.props.match.params.id}</span>
              <span>
                " will no longer be able to log in or access this SparkPost account. All API keys
                associated with this user will be transferred to you.
              </span>
            </p>
          }
          title="Are you sure you want to delete this user?"
        />
        <ConfirmationModal
          open={this.state.showDisableTfa}
          title="Are you sure you want to disable two-factor authentication for this user?"
          content={
            <p>
              Disabling two-factor authentication will also delete their two-factor backup codes.
              The next time they log in, they'll have to use their password or single sign-on if
              available.
            </p>
          }
          onConfirm={this.handleDisableTfa}
          onCancel={this.toggleTfaModal}
          confirming={updatePending}
          confirmVerb={updatePending ? 'Disabling' : 'Disable'}
        />
      </Page>
    );
  }
}

export default EditPage;
