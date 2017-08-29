import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { billingCreate, updateSubscription } from '../../actions/zuora';
import { getPlans, getBillingCountries } from '../../actions/account';

import UpgradeModal from './components/UpgradeModal';
import Layout from '../../components/Layout/Layout';
import { Page, Panel, Grid } from '@sparkpost/matchbox';

class BillingPage extends Component {
  state = {
    showUpgradeModal: false
  }

  togglePlansModal = () => {
    this.setState({ showUpgradeModal: !this.state.showUpgradeModal });
  }

  componentDidMount () {
    if (!this.props.billing.plans) {
      this.props.getPlans();
    }

    if (!this.props.billing.countries) {
      this.props.getBillingCountries();
    }
  }

  createBillingAccount (values) {
    const {
      cardName,
      cardNumber,
      email,
      address1,
      address2,
      city,
      state,
      country,
      zipCode,
      billingId
    } = values;

    // For CORS Endpoint
    const siftData = {
      email: email,
      cardholder_name: cardName,
      address1: address1,
      address2: address2,
      city: city,
      state: state,
      country: country,
      zip_code: zipCode,
      bin: cardNumber.slice(0, 6),
      last_four: cardNumber.slice(-4),
      plan_id: billingId
    };

    // For Zuora
    const billingData = {
      billingId: billingId,
      billToContact: {
        firstName: values.firstName,
        lastName: values.lastName,
        workEmail: email,
        country,
        state
      },
      creditCard: {
        cardType: values.cardType,
        cardNumber: cardNumber,
        expirationMonth: values.expirationMonth,
        expirationYear: values.expirationYear,
        securityCode: values.cvc,
        cardHolderInfo: {
          cardHolderName: cardName,
          addressLine1: address1,
          addressLine2: address2,
          city: city,
          zipCode: zipCode
        }
      }
    };

    this.props.billingCreate(siftData, billingData);
  }

  // Submit function given to CreditCardForm
  updatePlan = (values) => {
    if (this.props.account.billing) {
      const updatePlan = _.find(this.props.billing.plans, { 'billingId': values.billingId });
      this.props.updateSubscription(updatePlan.code);
    } else {
      this.createBillingAccount(values);
    }
  }

  render () {
    const { account, billing } = this.props;

    // TODO: develop pending status for account reducer
    const loading = Object.keys(account).length === 0 || billing.plansLoading || billing.countriesLoading;

    const currentCode = !loading ? account.subscription.code : undefined;
    const currentPlan = currentCode ? _.find(billing.plans, { 'code': currentCode }) : { price: 0, volume: 0, overage: 0 };

    const publicPlans = _.filter(billing.plans, (plan) => {
      return plan.status === 'public';
    });

    const freePlan = currentPlan.name === 'Free';
    const billingPanelActions = [{ content: freePlan ? 'Upgrade' : 'Change Plan', onClick: this.togglePlansModal }];

    // Set defaults for plans without all keys
    currentPlan.monthly = currentPlan.monthly ? currentPlan.monthly : 0;
    currentPlan.overage = currentPlan.overage ? currentPlan.overage : 'N/A';

    return (
      <Layout.App loading={loading}>
        <Page title='Billing'/>
        <Panel
          sectioned accent title='Your Plan' actions={billingPanelActions}>
          <Panel.Section >
            <Grid>
              <Grid.Column>
                Price <br/><br/>
                ${ currentPlan.monthly.toLocaleString() + ' monthly' }
              </Grid.Column>
              <Grid.Column>
                Emails <br/><br/>
                { currentPlan.volume.toLocaleString() }
              </Grid.Column>
              <Grid.Column>
                Overage <br/><br/>
                { currentPlan.overage.toLocaleString() + ' per email' }
              </Grid.Column>
            </Grid>
          </Panel.Section>
        </Panel>
        { this.state.showUpgradeModal &&
          <UpgradeModal
            open={this.state.showUpgradeModal}
            freePlan={freePlan}
            handleToggle={this.togglePlansModal}
            plans={publicPlans}
            currentPlan={currentPlan}
            updatePlan={this.updatePlan}
            currentUser={this.props.currentUser}
            countries={this.props.billing.countries}
            hasBilling={!!account.billing}
          /> }
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
