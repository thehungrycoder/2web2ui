/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, PlanPicker } from 'components';
import { Page, Panel } from '@sparkpost/matchbox';

// import { getPlans } from 'actions/account';
import { getBillingCountries } from 'actions/billing';
// import _ from 'lodash';

class BillingPage extends Component {
  componentDidMount() {

  }

  render() {
    const { billing, account, plans } = this.props;

    return (
      <Layout.App>
        <Page title='Billing'/>
        <Panel title='Your Plan' accent>

        </Panel>
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ account, billing }) => ({
});

export default connect(mapStateToProps, {})(BillingPage);
