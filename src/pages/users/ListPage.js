import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import fp from 'lodash/fp';
import { Page, Tag } from '@sparkpost/matchbox';
import TimeAgo from 'react-timeago';
import { Users } from 'src/components/images';
import PageLink from 'src/components/pageLink/PageLink';

import * as usersActions from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

import { Loading, ApiErrorBanner, DeleteModal, TableCollection, ActionPopover } from 'src/components';
import User from './components/User';

const COLUMNS = [
  { label: 'User', sortKey: 'name' },
  { label: 'Role', sortKey: 'access' },
  { label: 'Two Factor Auth', sortKey: 'tfa_enabled' },
  { label: 'Last Login', sortKey: 'last_login' },
  null
];

export const Actions = ({ username, deletable, onDelete }) => {
  const actions = [ { content: 'Edit', to: `/account/users/edit/${username}`, component: Link } ];
  if (deletable) {
    actions.push({ content: 'Delete', onClick: () => onDelete(username) });
  }
  return <ActionPopover actions={actions} />;
};

Actions.displayName = 'Actions';

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
    <User name={user.name} email={user.email} username={user.username} />,
    user.access,
    user.tfa_enabled ? <Tag color={'blue'}>Enabled</Tag> : <Tag>Disabled</Tag>,
    user.last_login ? <TimeAgo date={user.last_login} live={false} /> : 'Never',
    <Actions username={user.username} deletable={!user.isCurrentUser} onDelete={this.handleDeleteRequest} />
  ];

  handleCancel = () => { this.setState(DEFAULT_STATE); };

  handleDelete = () => {
    const { userToDelete } = this.state;

    this.setState(DEFAULT_STATE, () => {
      this.props.deleteUser(userToDelete.username);
    });
  };

  handleDeleteRequest = (username) => {
    const user = fp.find((user) => user.username === username)(this.props.users);
    this.setState({ userToDelete: user });
  };

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
        content={<p><span>User "</span><span>{name}</span><span>" will no longer be able to log in or access this SparkPost account. All API keys associated with this user will be transferred to you.</span></p>}
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
        {this.renderDeleteModal()}
      </div>
    );
  }

  render() {
    const { currentUser, loading, error, users } = this.props;

    if (loading) {
      return <Loading />;
    }

    return (
      <Page
        title="Users"
        primaryAction={primaryAction}
        empty={{
          show: users.length === 1,
          title: 'Invite Your Team to SparkPost',
          image: Users,
          content: <p>Manage your team's accounts and roles.</p>,
          secondaryAction: {
            Component: PageLink,
            content: 'Edit your user account',
            to: `/account/users/edit/${currentUser.username}`
          }
        }}>
        {error ? this.renderError() : this.renderPage()}
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.currentUser,
  error: state.users.error,
  loading: state.users.loading,
  users: selectUsers(state)
});

export default connect(mapStateToProps, usersActions)(ListPage);
