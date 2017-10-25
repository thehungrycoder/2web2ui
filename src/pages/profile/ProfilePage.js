import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Page, Panel, Table, TextField, Button } from '@sparkpost/matchbox';
import NameForm from './NameForm';

export class ProfilePage extends Component {
  render() {
    const {
      username,
      email,
      customer
    } = this.props.currentUser;

    return (
      <div>
        <Page title='Profile' />
        <Panel>
          <Table>
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
          </Table>
        </Panel>

        <Panel sectioned title='Edit Profile'>
          <NameForm />
        </Panel>

        <Panel sectioned title='Update Password'>
          <TextField
            id='currentPassword'
            label='Current Password'
          />

          <TextField
            id='newPassword'
            label='New Password'
          />

          <Button>Update Password</Button>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = ({ form, account, currentUser }) => ({
  account,
  currentUser
});

export default connect(mapStateToProps)(ProfilePage);
