import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import UsageReport from '../../components/UsageReport/UsageReport';
// import { Panel, Table } from '@sparkpost/matchbox';

export class DashboardPage extends Component {
  render () {
    return (
      <Layout.App>
        <h1>My Dashboard</h1>
        <UsageReport />
      </Layout.App>
    );
  }
}

export default connect(({ account, currentUser }) => ({ account, currentUser }))(DashboardPage);
