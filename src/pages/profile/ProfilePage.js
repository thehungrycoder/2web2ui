import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel, Table } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';
import { confirmPassword } from 'src/actions/auth';

import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';
import { showAlert } from 'src/actions/globalAlert';

export class ProfilePage extends Component {
  updateName = (values) => {
    const { username } = this.props.currentUser;
    return this.props.updateUser(username, values);
  }

  updatePassword = (values) => {
    const { username } = this.props.currentUser;
    const { showAlert } = this.props;
    const { currentPassword, newPassword } = values;

    return this.props.confirmPassword(username, currentPassword)
      .then(() => this.props.updateUser(username, { password: newPassword }))
      .catch((e) => showAlert({ type: 'error', message: 'Unable to update password' }));
  }

  render() {
    const {
      username,
      email,
      customer
    } = this.props.currentUser;

    return (
      <Page title='Profile'>
        <Panel>
          <Table>
            <tbody>
              <Table.Row>
                <Table.HeaderCell>Account ID</Table.HeaderCell>
                <Table.Cell>{ customer }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.Cell>{ username }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell>Email Address</Table.HeaderCell>
                <Table.Cell>{ email }</Table.Cell>
              </Table.Row>
            </tbody>
          </Table>
        </Panel>

        <Panel sectioned title='Edit Profile'>
          <NameForm onSubmit={this.updateName} />
        </Panel>

        <Panel sectioned title='Update Password'>
          <PasswordForm onSubmit={this.updatePassword} />
        </Panel>
      </Page>
    );
  }
}

const mapStateToProps = ({ form, account, currentUser }) => ({
  account,
  currentUser
});

export default connect(mapStateToProps, { updateUser, confirmPassword, showAlert })(ProfilePage);
