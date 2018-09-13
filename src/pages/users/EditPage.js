import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { Loading, DeleteModal } from 'src/components';
import { updateUser, listUsers, deleteUser } from 'src/actions/users';
import { selectUserById } from 'src/selectors/users';
import RedirectAndAlert from 'src/components/globalAlert/RedirectAndAlert';

import RoleRadioGroup from './components/RoleRadioGroup';

import _ from 'lodash';

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

  afterDelete = () => {
    this.toggleDelete();
    this.props.history.push('/account/users');
  };

  deleteUser = () => {
    const { deleteUser } = this.props;
    const user = this.props.match.params.id;

    return deleteUser(user)
      .then(() => {
        this.afterDelete();
      });
  };

  handleUserUpdate = (values) => {
    const { updateUser } = this.props;

    const username = this.props.match.params.id;

    return updateUser(username, values).catch((err) => {
      // Required to properly control 'submitFailed' & 'submitSucceeded'
      throw new SubmissionError(err);
    });
  };

  componentDidMount() {
    this.props.listUsers();
  }

  render() {
    const { currentUser, handleSubmit, loadingError, user, users } = this.props;

    if (loadingError) {
      return <Redirect to="/account/users" />;
    }

    // Load until we have at least one user
    if (_.isEmpty(users)) {
      return <Loading />;
    }

    // Error if user is not in the user list
    if (!user) {
      return <RedirectAndAlert to="/account/users" alert={{ type: 'error', message: 'Unknown user???' }} />;
    }

    const secondaryActions = [];

    if (!user.isCurrentUser) {
      secondaryActions.push({
        content: 'Delete',
        onClick: this.toggleDelete
      });
    }

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
                name='is_sso'
                label='Enable single sign-on authentication for this user'
                component={CheckboxWrapper}
                type="checkbox"
              />
            </Panel.Section>
            <Panel.Section>
              <Button primary submit>{'Update user'}</Button>
            </Panel.Section>
          </form>
        </Panel>
        <DeleteModal
          onDelete={this.deleteUser}
          onCancel={this.toggleDelete}
          open={this.state.showDelete}
          content={<p><span>User "</span><span>{this.props.match.params.id}</span><span>" will no longer be able to log in or access this SparkPost account and all API keys associated with this user will be immediately deleted.</span></p>}
          title="Are you sure you want to delete this user?"
        />
      </Page>
    );
  }
}

const mapStateToProps = (state, props) => {
  const user = selectUserById(state, props.match.params.id);

  return {
    user,
    currentUser: state.currentUser,
    users: state.users.entities,
    loadingError: state.users.error,
    initialValues: {
      access: _.get(user, 'access'),
      is_sso: _.get(user, 'is_sso')
    }
  };
};

const mapDispatchToProps = { updateUser, listUsers, deleteUser };
const formOptions = { form: 'userEditForm', enableReinitialize: true };

export default
connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(EditPage)
);
