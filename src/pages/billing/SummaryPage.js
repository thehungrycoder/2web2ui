import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Page, Panel, WindowEvent } from '@sparkpost/matchbox';

import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { list as getSendingIps } from 'src/actions/sendingIps';
import config from 'src/config';
import {
  shouldExposeCardSelector, canChangePlanSelector, currentPlanSelector, dedicatedIpPrice,
  publicPlansSelector
} from 'src/selectors/accountBillingInfo';

import { Loading, Modal, LabelledValue } from 'src/components';
import { PremiumBanner, EnterpriseBanner, SuspendedBanner, ManuallyBilledBanner, PendingPlanBanner } from './components/Banners';
import UpdatePayment from './forms/UpdatePayment';
import UpdateContact from './forms/UpdateContact';
import AddIps from './forms/AddIps';
import { PlanSummary, CardSummary } from './components/SummarySection';

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';
const MAX_IPS = config.sendingIps.maxPerAccount;

export class SummaryPage extends Component {
  state = {
    show: false
  }

  componentWillMount() {
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
          { this.renderDedicatedIps() }
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

  renderDedicatedIps = () => {
    // Exit early for free accounts
    if (!this.props.shouldExposeCard) { return null; }

    const sendingIpCount = this.props.sendingIps.length;
    const hasReachedMax = sendingIpCount >= MAX_IPS;

    // There are some paid accounts that do not allow dedicated IPs
    const action = this.props.currentPlan.canPurchaseIps === true
      ? { content: 'Add Dedicated IPs', disabled: hasReachedMax, onClick: () => this.handleModal(IP_MODAL) }
      : { content: 'Upgrade Now', to: '/account/billing/plan', Component: Link };

    return (
      <Panel.Section actions={[action]}>
        <LabelledValue label='Dedicated IPs'>
          <h6>{ sendingIpCount } for { this.props.dedicatedIpPrice }</h6>
          { hasReachedMax && <p>You have reached the maximum allowed.</p>}
        </LabelledValue>
      </Panel.Section>
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

  render() {
    if (this.props.loading) {
      return <Loading />;
    }

    const pageMarkup = this.props.account.subscription.self_serve
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
  canChangePlan: canChangePlanSelector(state),
  currentPlan: currentPlanSelector(state),
  dedicatedIpPrice: dedicatedIpPrice(state),
  plans: publicPlansSelector(state),
  sendingIps: state.sendingIps.list
});
export default connect(mapStateToProps, { getSendingIps, getPlans, fetchAccount })(SummaryPage);
