import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout } from 'src/components';
import { Page, Panel, Modal, WindowEvent } from '@sparkpost/matchbox';

import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { shouldExposeCardSelector, canChangePlanSelector, currentPlanSelector, publicPlansSelector } from 'src/selectors/accountBillingInfo';

import { PremiumBanner, EnterpriseBanner, SuspendedBanner, ManuallyBilledBanner, PendingPlanBanner } from './components/Banners';
import UpdatePayment from './forms/UpdatePayment';
import UpdateContact from './forms/UpdateContact';
import AddIps from './forms/AddIps';
import { SummarySection, PlanSummary, CardSummary } from './components/SummarySection';

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';

export class SummaryPage extends Component {
  state = {
    show: false
  }

  componentWillMount() {
    this.props.getPlans();
  }

  handleModal = (modal = false) => {
    this.setState({ show: this.state.show ? false : modal });
  }

  handleEscape = (e) => {
    if (e.key === 'Escape') {
      this.handleModal();
    }
  }

  renderSummary = () => {
    const { account, currentPlan, canChangePlan, shouldExposeCard } = this.props;
    const { show } = this.state;
    let changePlanActions = {};

    if (canChangePlan) {
      const changePlanLabel = currentPlan.isFree ? 'Upgrade Now' : 'Change Plan';
      changePlanActions = { actions: [{ content: changePlanLabel, to: '/account/billing/plan', Component: Link }]};
    }

    return (
      <div>
        <SuspendedBanner account={account} />
        <PendingPlanBanner account={account} />

        <Panel accent title='Plan Overview'>
          <Panel.Section {...changePlanActions}>
            <PlanSummary label='Your Plan' plan={currentPlan} />
          </Panel.Section>
          { shouldExposeCard && this.renderDedicatedIps() }
        </Panel>

        { shouldExposeCard && this.renderBillingSummary() }

        <PremiumBanner />
        <EnterpriseBanner />

        <Modal open={!!show}>
          <WindowEvent event='keydown' handler={this.handleEscape} />
          { show === PAYMENT_MODAL && <UpdatePayment onCancel={this.handleModal}/> }
          { show === CONTACT_MODAL && <UpdateContact onCancel={this.handleModal}/> }
          { show === IP_MODAL && <AddIps onCancel={this.handleModal}/> }
        </Modal>
      </div>
    );
  }

  renderDedicatedIps = () => (
    <Panel.Section actions={[{ content: 'Add Dedicated IPs', onClick: () => this.handleModal(IP_MODAL) }]}>
      <SummarySection label='Dedicated IPs'>
        <h6>0</h6>
      </SummarySection>
    </Panel.Section>
  )

  renderBillingSummary = () => {
    const { billing } = this.props;
    return (
      <Panel title='Billing'>
        <Panel.Section actions={[{ content: 'Update Payment Information', onClick: () => this.handleModal(PAYMENT_MODAL) }]}>
          <CardSummary label='Credit Card' billing={billing} />
        </Panel.Section>
        <Panel.Section actions={[{ content: 'Update Billing Contact', onClick: () => this.handleModal(CONTACT_MODAL) }]}>
          <SummarySection label='Billing Contact'>
            <h6>{ billing.first_name } { billing.last_name }</h6>
            <p>{ billing.email }</p>
          </SummarySection>
        </Panel.Section>
      </Panel>
    );
  }

  render() {
    const pageMarkup = this.props.account.subscription.self_serve
      ? this.renderSummary()
      : <ManuallyBilledBanner account={this.props.account} />;

    return (
      <Layout.App loading={this.props.loading}>
        <Page title='Billing'/>
        { pageMarkup }
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading || state.billing.plansLoading || !state.account.subscription,
  account: state.account,
  billing: state.account.billing,
  shouldExposeCard: shouldExposeCardSelector(state),
  canChangePlan: canChangePlanSelector(state),
  currentPlan: currentPlanSelector(state),
  plans: publicPlansSelector(state)
});
export default connect(mapStateToProps, { getPlans, fetchAccount })(SummaryPage);
