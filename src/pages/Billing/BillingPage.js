import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { billingCreate, updateSubscription, getBillingCountries } from '../../actions/billing';
import { getPlans } from '../../actions/account';

import UpgradeModal from './components/UpgradeModal';
import Layout from '../../components/Layout/Layout';
import { Page } from '@sparkpost/matchbox';
import YourPlanPanel from './components/YourPlanPanel';

class BillingPage extends Component {
  state = {
    showUpgradeModal: false
  }

  togglePlansModal = () => {
    this.setState({ showUpgradeModal: !this.state.showUpgradeModal });
  }

  componentDidMount() {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  // Submit function given to CreditCardForm
  updatePlan = (values) => {
    if (this.props.account.billing) {
      this.props.updateSubscription(values.selectedPlan.code);
    } else {
      this.props.billingCreate(values);
    }
  }

  renderBilling(account, billing) {
    // TODO: move billing reducer into account reducer to have access to account
    //       and do all this in there. Or....SELECTORS
    const currentPlan = _.find(billing.plans, { 'code': account.subscription.code });
    const publicPlans = _.filter(billing.plans, (plan) => plan.status === 'public');

    const panelActions = [{ content: 'Change Plan', onClick: this.togglePlansModal }];

    const { showUpgradeModal } = this.state;

    const modalProps = {
      open: showUpgradeModal,
      handleToggle: this.togglePlansModal,
      plans: publicPlans,
      currentPlan: currentPlan,
      updatePlan: this.updatePlan,
      currentUser: this.props.currentUser,
      countries: this.props.billing.countries,
      hasBilling: !!account.billing
    };

    return (
      <div>
        <YourPlanPanel currentPlan={currentPlan} actions={panelActions} />
        <UpgradeModal {...modalProps}/>
      </div>
    );
  }

  render() {
    const { account, billing } = this.props;

    // TODO: develop pending status for account reducer
    const loading = Object.keys(account).length === 0 || billing.plansLoading || billing.countriesLoading;

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>
        { !loading && this.renderBilling(account, billing) }
      </Layout.App>
    );
  }
}

const mapStateToProps = ({ account, billing, currentUser }) => ({
  account,
  billing,
  currentUser
});

export default connect(mapStateToProps, { getPlans, getBillingCountries, billingCreate, updateSubscription })(BillingPage);
