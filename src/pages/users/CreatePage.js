import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { Page, Panel } from '@sparkpost/matchbox';

import Layout from 'src/components/layout/Layout';
import { inviteUser } from 'src/actions/users';

import UserForm from './components/UserForm';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};


class CreatePage extends React.Component {
  onSubmit = (values) => {
    const { email, access } = values;
    const { inviteUser, history } = this.props;
    return inviteUser(email, access).then((res) => {
      history.push('/account/users');
    });
  };

  render() {
    return <Layout.App loading={this.props.loading}>
      <Page title="Add User" breadcrumbAction={breadcrumbAction} />
      <Panel>
        <Panel.Section>
          <UserForm onSubmit={ this.onSubmit } />
        </Panel.Section>
      </Panel>
    </Layout.App>;
  }
}

export default withRouter(
  connect(null, { inviteUser })(CreatePage)
);
