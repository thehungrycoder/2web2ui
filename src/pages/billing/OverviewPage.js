import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout } from 'components';
import { Page, Panel, Banner } from '@sparkpost/matchbox';

import { getPlans } from 'actions/account';
import { overviewProps } from 'selectors/accountBillingInfo';

import { SummarySection, PlanSummary } from './components/SummarySection';

class OverviewPage extends Component {
  componentDidMount() {
    if (!this.props.plans.length) {
      this.props.getPlans();
    }
  }

  render() {
    const { currentPlan, loading } = this.props;

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>
        <Banner title='Yer suspended' status='warning' action={{ content: 'Update Billing Information' }}>Update your billing info or something</Banner>

        <Panel accent title='Plan Overview'>
          <Panel.Section actions={[{ content: 'Change Plan', to: '/account/billing/change', Component: Link }]}>
            <PlanSummary plan={currentPlan} />
          </Panel.Section>
          <Panel.Section actions={[{ content: 'Add Dedicated IPs' }]}>
            <SummarySection label='Dedicated IPs'>
              0
            </SummarySection>
          </Panel.Section>
        </Panel>

        <Panel title='Billing'>
          <Panel.Section actions={[{ content: 'Update Payment Information' }]}>
            <SummarySection label='Payment'>
              <div>Avi Goldman</div>
              <div><small>···· 1234 VISA</small></div>
              <div><small>Expires 01/20</small></div>
            </SummarySection>
          </Panel.Section>
          <Panel.Section actions={[{ content: 'Update Billing Contact' }]}>
            <SummarySection label='Billing Contact'>
              <div>email@address.com</div>
              <div><small>123 Main St.</small></div>
            </SummarySection>
          </Panel.Section>
        </Panel>

        <Banner title='Premium Addon Plan' action={{ content: 'Contact Us' }}>
          <p>Technical and deliverability account management - full service support on a first name basis.</p>
          <ul>
            <li>Dedicated Technical Account Manager</li>
            <li>Proactive deliverability reporting, planning & reviews</li>
            <li>Global ISP relations and mediation</li>
            <li>Deliverability data analysis and guidance with 250ok</li>
          </ul>
        </Banner>
        <Banner title='Enterprise' action={{ content: 'Contact Us' }}>
          <p>Enterprise-grade guarantees and SLAs across email, push, and SMS - manage, analyzed, and reported from a single console.</p>
          <ul>
            <li>The industry's best uptime SLAs with service credits</li>
            <li>Guaranteed burst rates</li>
            <li>Push notifications and SMS messaging</li>
            <li>Single sign-on support</li>
            <li>Support for iOS universal links</li>
          </ul>
        </Banner>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({ ...overviewProps(state) });
export default connect(mapStateToProps, { getPlans })(OverviewPage);
