import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import fp from 'lodash/fp';
import { Page } from '@sparkpost/matchbox';
import { Users } from 'src/components/images';
import TimeAgo from 'react-timeago';

import * as usersActions from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

import { Loading, ApiErrorBanner, DeleteModal, TableCollection } from 'src/components';
import RoleSelect from './components/RoleSelect';
import DeleteButton from './components/DeleteButton';

const COLUMNS = [
  { label: 'Name', sortKey: 'name' },
  { label: 'Role', sortKey: 'access' },
  { label: 'Email', sortKey: 'email' },
  { label: 'Last Login', sortKey: 'last_login' },
  null
];
const DEFAULT_STATE = {
  userToDelete: {}
};

const primaryAction = {
  content: 'Invite User',
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
    <RoleSelect
      disabled={user.isCurrentUser}
      name={user.username}
      onChange={this.handleAccessChange}
      value={user.access}
      allowSuperUser={user.access === 'superuser'}
    />,
    user.email,
    user.last_login ? <TimeAgo date={user.last_login} live={false} /> : 'Never',
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
        onDelete={this.handleDelete}
        onCancel={this.handleCancel}
        open={isOpen}
        content={<p>User "{name}" will no longer be able to log in or access this SparkPost account and all API keys associated with this user will be immediately deleted.</p>}
        title="Are you sure you want to delete this user?"
      />
    );
  }

  renderPage() {
    return (
      <div>
        <TableCollection
          columns={COLUMNS}
          getRowData={this.getRowData}
          pagination={true}
          rows={this.props.users}
          filterBox={{
            show: true,
            keyMap: { role: 'access' },
            exampleModifiers: ['name', 'email', 'role'],
            itemToStringKeys: ['username', 'name', 'email']
          }}
          defaultSortColumn='name'
        />
        { this.renderDeleteModal() }
      </div>
    );
  }

  render() {
    const { loading, error, users } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        primaryAction={primaryAction}
        title="Users"
        empty={{
          show: users.length === 1,
          title: 'Invite Your Team to SparkPost',
          image: Users,
          content: <p>Manage your team's accounts and roles.</p>
        }}>
        { error ? this.renderError() : this.renderPage() }
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  error: state.users.error,
  loading: state.users.loading,
  users: selectUsers(state)
});

export default connect(mapStateToProps, usersActions)(ListPage);
