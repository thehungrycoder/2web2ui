import React, { Component } from 'react';
import { connect } from 'react-redux';

import Layout from '../../components/Layout/Layout';
import { Page, Panel, Button } from '@sparkpost/matchbox';

class BillingPage extends Component {
  render () {
    const { account } = this.props;

    const loading = Object.keys(account).length === 0;

    const { subscription } = account;

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>
        <Panel sectioned>
          <Panel.Section>
            Plan: {subscription ? subscription.name : '...'}
          </Panel.Section>
          <Panel.Section>
            <Button primary>Upgrade</Button>
          </Panel.Section>
        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ account }) => ({
  account
});

export default connect(mapStateToProps)(BillingPage);
