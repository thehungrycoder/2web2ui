import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../components/Layout/Layout';
import { Panel, Table } from '@sparkpost/matchbox';

export class DashboardPage extends Component {
  renderKeyValue (object, key) {
    return <Table.Row key={key} rowData={ [key, JSON.stringify(this.props[object][key])] } />;
  }

  render () {
    const accountMarkup = this.props.account
      ? Object.keys(this.props.account).map((key) => this.renderKeyValue('account', key))
      : null;

    const userMarkup = this.props.currentUser
        ? Object.keys(this.props.currentUser).map((key) => this.renderKeyValue('currentUser', key))
        : null;

    return (
      <Layout.App>
        <h1>My Dashboard</h1>

        <Panel>
          <Table>
            <thead>
              <Table.Row>
                <Table.HeaderCell style={{width: '200px'}}>Key</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
              </Table.Row>
            </thead>
            <tbody>
              { accountMarkup }
            </tbody>
          </Table>
        </Panel>

        <Panel>
          <Table>
            <thead>
              <Table.Row>
                <Table.HeaderCell style={{width: '200px'}}>Key</Table.HeaderCell>
                <Table.HeaderCell>Value</Table.HeaderCell>
              </Table.Row>
            </thead>
            <tbody>
              { userMarkup }
            </tbody>
          </Table>
        </Panel>
      </Layout.App>
    );
  }
}

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
