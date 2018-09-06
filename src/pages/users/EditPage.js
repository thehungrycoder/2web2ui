import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { Loading } from 'src/components';
import { updateUser, listUsers } from 'src/actions/users';
import { selectUserById } from 'src/selectors/users';

import RoleSelect from './components/RoleSelect';

import _ from 'lodash';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};

export class EditPage extends Component {

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
    const { handleSubmit, loading } = this.props;

    const secondaryActions = [{ content: 'Delete' }];

    if (loading) {
      return <Loading />;
    }

    return <Page
      title={'Edit User'}
      breadcrumbAction={breadcrumbAction}
      secondaryActions={secondaryActions}>
      <Panel>
        <form onSubmit={handleSubmit(this.handleUserUpdate)}>
          <Panel.Section>
            <Field
              name='access'
              component={RoleSelect}
              label='Role'
            />
          </Panel.Section>
          <Panel.Section>
            <Field
              name='is_sso'
              label='Enable single sign-on authentication for this user'
              component={CheckboxWrapper}
            />
          </Panel.Section>
          <Panel.Section>
            <Button primary submit>{'Update user'}</Button>
          </Panel.Section>
        </form>
      </Panel>
    </Page>;
  }
}

const mapStateToProps = (state, props) => {

  const user = selectUserById(state, props.match.params.id);

  return {
    loading: state.users.loading,
    initialValues: {
      access: _.get(user, 'access'),
      is_sso: _.get(user, 'is_sso')
    }
  };
};

const mapDispatchToProps = { updateUser, listUsers };

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'userEditForm', enableReinitialize: true })(EditPage))
);
