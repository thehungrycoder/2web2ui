import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, WindowEvent } from 'src/components';
import { Page, Panel, Modal } from '@sparkpost/matchbox';

import { getPlans } from 'src/actions/account';
import { selectBillable, canChangePlan, selectCurrentPlan, selectPublicPlans } from 'src/selectors/accountBillingInfo';

import { PremiumBanner, EnterpriseBanner, SuspendedBanner } from './components/Banners';
import UpdatePayment from './formContainers/UpdatePayment';
import UpdateContact from './formContainers/UpdateContact';
import { SummarySection, PlanSummary, CardSummary } from './components/SummarySection';

const PAYMENT_MODAL = 'payment';
const CONTACT_MODAL = 'contact';

class SummaryPage extends Component {
  state = {
    show: false
  }

  componentDidMount() {
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

  renderBillingSummary = () => {
    const { billing } = this.props;
    return (
      <Panel title='Billing'>
        <Panel.Section actions={[{ content: 'Update Payment Information', onClick: () => this.handleModal(PAYMENT_MODAL) }]}>
          <CardSummary label='Credit Card' billing={this.props.billing} />
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
    const { currentPlan, loading, canChangePlan, billable } = this.props;
    const { show } = this.state;

    let changePlanAction = {};

    if (canChangePlan) {
      const changePlanLabel = currentPlan.isFree ? 'Upgrade Now' : 'Change Plan';
      changePlanAction = { content: changePlanLabel, to: '/account/billing/plan', Component: Link };
    }

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>

        <SuspendedBanner account={this.props.account} />

        <Panel accent title='Plan Overview'>
          <Panel.Section actions={[changePlanAction]}>
            <PlanSummary label='Your Plan' plan={currentPlan} />
          </Panel.Section>
          <Panel.Section actions={[{ content: 'Add Dedicated IPs' }]}>
            <SummarySection label='Dedicated IPs'>
              <h6>0</h6>
            </SummarySection>
          </Panel.Section>
        </Panel>

        { billable && this.renderBillingSummary() }

        <PremiumBanner />
        <EnterpriseBanner />

        <Modal open={!!this.state.show}>
          <WindowEvent event='keydown' handler={this.handleEscape} />
          { show === PAYMENT_MODAL && <UpdatePayment onCancel={this.handleModal}/> }
          { show === CONTACT_MODAL && <UpdateContact onCancel={this.handleModal}/> }
        </Modal>
      </Layout.App>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: !Object.keys(state.account).length || state.billing.plansLoading,
  account: state.account,
  billing: state.account.billing,
  billable: selectBillable(state),
  canChangePlan: canChangePlan(state),
  currentPlan: selectCurrentPlan(state),
  plans: selectPublicPlans(state)
});
export default connect(mapStateToProps, { getPlans })(SummaryPage);
