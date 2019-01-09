import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@sparkpost/matchbox';
import { Modal, LabelledValue } from 'src/components';
import { PremiumBanner, EnterpriseBanner, PendingPlanBanner, FreePlanWarningBanner } from './Banners';
import UpdatePaymentForm from '../forms/UpdatePaymentForm';
import UpdateContactForm from '../forms/UpdateContactForm';
import AddIps from '../forms/AddIps';
import DedicatedIpSummarySection from './DedicatedIpSummarySection';
import InvoiceHistory from './InvoiceHistory';
import CardSummary from './CardSummary';
import PlanSummary from './PlanSummary';

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';
const IP_MODAL = 'ip';

export default class BillingSummary extends Component {
  state = {
    show: false
  }

  handleModal = (modal = false) => {
    this.setState({ show: this.state.show ? false : modal });
  }

  handlePaymentModal = () => this.handleModal(PAYMENT_MODAL);
  handleContactModal = () => this.handleModal(CONTACT_MODAL);
  handleIpModal = () => this.handleModal(IP_MODAL);

  renderSummary = () => {
    const { account } = this.props;
    const { billing } = account;
    return (
      <Panel title='Billing'>
        <Panel.Section actions={[{ content: 'Update Payment Information', onClick: this.handlePaymentModal, color: 'orange' }]}>
          <CardSummary label='Credit Card' billing={billing} />
        </Panel.Section>
        <Panel.Section actions={[{ content: 'Update Billing Contact', onClick: this.handleContactModal, color: 'orange' }]}>
          <LabelledValue label='Billing Contact'>
            <h6>{billing.first_name} {billing.last_name}</h6>
            <p>{billing.email}</p>
          </LabelledValue>
        </Panel.Section>
      </Panel>
    );
  }

  renderDedicatedIpSummarySection = () => (
    <DedicatedIpSummarySection
      count={this.props.sendingIps.length}
      plan={this.props.currentPlan}
      onClick={this.handleIpModal}
      isAWSAccount={this.props.isAWSAccount}
    />
  );

  render() {
    const { account, currentPlan, canChangePlan, canUpdateBillingInfo, canPurchaseIps, invoices, isAWSAccount, accountAgeInDays } = this.props;
    const { show } = this.state;
    let changePlanActions = {};

    if (canChangePlan) {
      const changePlanLabel = currentPlan.isFree ? 'Upgrade Now' : 'Change Plan';
      changePlanActions = { actions: [{ content: changePlanLabel, to: '/account/billing/plan', Component: Link, color: 'orange' }]};
    }

    return (
      <div>
        <PendingPlanBanner account={account} />
        <FreePlanWarningBanner account={account} accountAgeInDays={accountAgeInDays} />
        <Panel accent title='Plan Overview'>
          <Panel.Section {...changePlanActions}>
            <LabelledValue label="Your Plan">
              <PlanSummary plan={account.subscription} />
            </LabelledValue>
          </Panel.Section>
          {canPurchaseIps && this.renderDedicatedIpSummarySection()}
        </Panel>

        {canUpdateBillingInfo && this.renderSummary()}

        {(invoices.length > 0) && <InvoiceHistory invoices={this.props.invoices} />}

        <PremiumBanner isAWSAccount={isAWSAccount} />
        <EnterpriseBanner />

        <Modal open={!!show} onClose={this.handleModal}>
          {show === PAYMENT_MODAL && <UpdatePaymentForm onCancel={this.handleModal}/>}
          {show === CONTACT_MODAL && <UpdateContactForm onCancel={this.handleModal}/>}
          {show === IP_MODAL && <AddIps onClose={this.handleModal}/>}
        </Modal>
      </div>
    );
  }

}
