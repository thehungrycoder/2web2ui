import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Page } from '@sparkpost/matchbox';

import * as usersActions from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
import TableCollection from 'src/components/collection/TableCollection';
import Layout from 'src/components/layout/Layout';

import AccessSelect from './AccessSelect';
import DeleteButton from './DeleteButton';

const COLUMNS = ['Name', 'Role', 'Email', 'Last Login', null];

export class ListPage extends Component {
  componentDidMount() {
    this.props.listUsers();
  }

  // Do not allow current user to change their access/role or delete their account
  getRowData = (user) => [
    user.name,
    <AccessSelect
      disabled={user.isCurrentUser}
      onChange={this.props.updateUser}
      user={user}
    />,
    user.email,
    user.last_login,
    <DeleteButton
      disabled={user.isCurrentUser}
      onSubmit={this.props.deleteUser}
      user={user}
    />
  ];

  renderError() {
    const { error, listUsers } = this.props;

    if (!error) { return null; }

    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your API keys."
        reload={listUsers}
      />
    );
  }

  render() {
    const { loading, users } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title="Users" />
        {this.renderError()}
        <TableCollection
          columns={COLUMNS}
          getRowData={this.getRowData}
          pagination={true}
          rows={users}
        />
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.users.error,
  loading: state.users.loading,
  users: selectUsers(state)
});

export default connect(mapStateToProps, usersActions)(ListPage);
