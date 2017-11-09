import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel, Table } from '@sparkpost/matchbox';

import { updateUser } from 'src/actions/users';

import NameForm from './components/NameForm';
import PasswordForm from './components/PasswordForm';

export class ProfilePage extends Component {
  updateName = (values) => {
    const { username } = this.props.currentUser;
    return this.props.updateUser(username, values);
  }

  updatePassword = (values) => {
    console.log(values); //eslint-disable-line
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

export default connect(mapStateToProps, { updateUser })(ProfilePage);
