import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel, WindowEvent } from '@sparkpost/matchbox';

import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { list as getSendingIps } from 'src/actions/sendingIps';
import { shouldExposeCardSelector, canChangePlanSelector, currentPlanSelector, publicPlansSelector, isSelfServeOrAWSSelector,
  canPurchaseIps } from 'src/selectors/accountBillingInfo';

import { Loading, Modal, LabelledValue } from 'src/components';
import { PremiumBanner, EnterpriseBanner, SuspendedBanner, ManuallyBilledBanner, PendingPlanBanner } from './components/Banners';
import UpdatePayment from './forms/UpdatePayment';
import UpdateContact from './forms/UpdateContact';
import AddIps from './forms/AddIps';
import DedicatedIpSummarySection from './components/DedicatedIpSummarySection';
import { CardSummary, PlanSummary } from './components/SummarySection';

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';

export class SummaryPage extends Component {
  state = {
    show: false
  }

  componentDidMount() {
    this.props.fetchAccount({ include: 'billing' });
    this.props.getPlans();
    this.props.getSendingIps();
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
    const { account, currentPlan, canChangePlan, shouldExposeCard, canPurchaseIps } = this.props;
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
          { canPurchaseIps && this.renderDedicatedIpSummarySection() }
        </Panel>

        { shouldExposeCard && this.renderBillingSummary() }

        <PremiumBanner />
        <EnterpriseBanner />

        <Modal open={!!show}>
          <WindowEvent event='keydown' handler={this.handleEscape} />
          { show === PAYMENT_MODAL && <UpdatePayment onCancel={this.handleModal}/> }
          { show === CONTACT_MODAL && <UpdateContact onCancel={this.handleModal}/> }
          { show === IP_MODAL && <AddIps onClose={this.handleModal}/> }
        </Modal>
      </div>
    );
  }

  renderBillingSummary = () => {
    const { billing } = this.props;
    return (
      <Panel title='Billing'>
        <Panel.Section actions={[{ content: 'Update Payment Information', onClick: () => this.handleModal(PAYMENT_MODAL) }]}>
          <CardSummary label='Credit Card' billing={billing} />
        </Panel.Section>
        <Panel.Section actions={[{ content: 'Update Billing Contact', onClick: () => this.handleModal(CONTACT_MODAL) }]}>
          <LabelledValue label='Billing Contact'>
            <h6>{ billing.first_name } { billing.last_name }</h6>
            <p>{ billing.email }</p>
          </LabelledValue>
        </Panel.Section>
      </Panel>
    );
  }

  renderDedicatedIpSummarySection = () => (
    <DedicatedIpSummarySection
      count={this.props.sendingIps.length}
      plan={this.props.currentPlan}
      onClick={() => this.handleModal(IP_MODAL)}
    />
  );

  render() {
    const { shouldShowBillingSummary } = this.props;
    if (this.props.loading) {
      return <Loading />;
    }

    const pageMarkup = shouldShowBillingSummary
      ? this.renderSummary()
      : <ManuallyBilledBanner account={this.props.account} />;

    return <Page title='Billing'>{ pageMarkup }</Page>;
  }
}

const mapStateToProps = (state) => ({
  loading: state.account.loading || state.billing.plansLoading || !state.account.subscription,
  account: state.account,
  billing: state.account.billing,
  shouldExposeCard: shouldExposeCardSelector(state),
  shouldShowBillingSummary: isSelfServeOrAWSSelector(state),
  canPurchaseIps: canPurchaseIps(state),
  canChangePlan: canChangePlanSelector(state),
  currentPlan: currentPlanSelector(state),
  plans: publicPlansSelector(state),
  sendingIps: state.sendingIps.list
});
export default connect(mapStateToProps, { getSendingIps, getPlans, fetchAccount })(SummaryPage);
