import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import fp from 'lodash/fp';
import { Page } from '@sparkpost/matchbox';

import * as usersActions from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

import { Loading, ApiErrorBanner, DeleteModal, TableCollection } from 'src/components';
import AccessSelect from './components/AccessSelect';
import DeleteButton from './components/DeleteButton';

const COLUMNS = ['Name', 'Role', 'Email', 'Last Login', null];
const DEFAULT_STATE = {
  userToDelete: {}
};

const primaryAction = {
  content: 'Add User',
  Component: Link,
  to: '/account/users/create'
};

export class ListPage extends Component {
  state = DEFAULT_STATE;

  componentDidMount() {
    this.props.listUsers();
  }

  // Do not allow current user to change their access/role or delete their account
  getRowData = (user) => [
    user.name,
    <AccessSelect
      disabled={user.isCurrentUser}
      name={user.username}
      onChange={this.handleAccessChange}
      value={user.access}
    />,
    user.email,
    user.last_login,
    <DeleteButton
      disabled={user.isCurrentUser}
      name={user.username}
      onClick={this.handleDeleteRequest}
    />
  ];

  handleAccessChange = ({ name, value }) => {
    this.props.updateUser(name, { access_level: value });
  }

  handleCancel = () => { this.setState(DEFAULT_STATE); }

  handleDelete = () => {
    const { userToDelete } = this.state;

    this.setState(DEFAULT_STATE, () => {
      this.props.deleteUser(userToDelete.username);
    });
  };

  handleDeleteRequest = (username) => {
    const user = fp.find((user) => user.username === username)(this.props.users);
    this.setState({ userToDelete: user });
  }

  renderError() {
    const { error, listUsers } = this.props;

    if (!error) { return null; }

    return (
      <ApiErrorBanner
        errorDetails={error.message}
        message="Sorry, we seem to have had some trouble loading your users."
        reload={listUsers}
      />
    );
  }

  // @note This component must always be the page to properly handle css transition
  renderDeleteModal() {
    const { userToDelete } = this.state;
    const isOpen = !fp.isEmpty(userToDelete);
    const name = fp.get('name')(userToDelete);

    return (
      <DeleteModal
        handleDelete={this.handleDelete}
        handleToggle={this.handleCancel}
        open={isOpen}
        text={`Are you sure you want to delete ${name}?`}
        title="Delete User"
      />
    );
  }

  render() {
    const { loading, users } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <div>
        <Page primaryAction={primaryAction} title="Users" />
        {this.renderError()}
        <TableCollection
          columns={COLUMNS}
          getRowData={this.getRowData}
          pagination={true}
          rows={users}
        />
        {this.renderDeleteModal()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.users.error,
  loading: state.users.loading,
  users: selectUsers(state)
});

export default connect(mapStateToProps, usersActions)(ListPage);
