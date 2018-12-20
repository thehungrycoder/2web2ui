import React, { Component, Fragment } from 'react';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { CenteredLogo, Loading, PlanPicker } from 'src/components';
import { FORMS } from 'src/constants';
import Steps from './components/Steps';
import { getPlans } from 'src/actions/account';
import { getBillingCountries, verifyPromoCode } from 'src/actions/billing';
import billingCreate from 'src/actions/billingCreate';
import { choosePlanMSTP } from 'src/selectors/onboarding';
import PaymentForm from 'src/pages/billing/forms/fields/PaymentForm';
import BillingAddressForm from 'src/pages/billing/forms/fields/BillingAddressForm';
import { isAws } from 'src/helpers/conditions/account';
import { not } from 'src/helpers/conditions';
import AccessControl from 'src/components/auth/AccessControl';
import { prepareCardInfo } from 'src/helpers/billing';
import PromoCode from 'src/components/billing/PromoCode';

const NEXT_STEP = '/onboarding/sending-domain';

export class OnboardingPlanPage extends Component {
  componentDidMount() {
    this.props.getPlans();
    this.props.getBillingCountries();
  }

  componentDidUpdate(prevProps) {
    const { hasError, history } = this.props;

    // if we can't get plans or countries form is useless
    // they can pick plan later from billing
    if (!prevProps.hasError && hasError) {
      history.push(NEXT_STEP);
    }
  }

  onSubmit = (values) => {
    const { billingCreate, showAlert, history } = this.props;

    const newValues = values.card && !values.planpicker.isFree
      ? { ...values, card: prepareCardInfo(values.card) }
      : values;

    // no billing updates needed since they are still on free plan
    if (newValues.planpicker.isFree) {
      history.push(NEXT_STEP);
      return;
    }

    // Note: billingCreate will update the subscription if the account is AWS
    return billingCreate(newValues)
      .then(() => history.push(NEXT_STEP))
      .then(() => showAlert({ type: 'success', message: 'Added your plan' }));
  };

  renderCCSection = () => {
    const { billing, submitting, selectedPlan = {}} = this.props;

    if (selectedPlan.isFree) {
      return (
        <Panel.Section>
          <p>Our full-featured, free account provides you:</p>
          <ul>
            <li>Up to 15,000 free messages for first 30 days, then 500/month forever.</li>
            <li>Access to all of our powerful API features.</li>
            <li>30 days of free technical support to get you up and running.</li>
          </ul>
        </Panel.Section>
      );
    }

    return (
      <Fragment>
        <Panel.Section>
          <PaymentForm
            formName={FORMS.JOIN_PLAN}
            disabled={submitting}
          />
        </Panel.Section>
        <Panel.Section>
          <BillingAddressForm
            formName={FORMS.JOIN_PLAN}
            disabled={submitting}
            countries={billing.countries}
          />
        </Panel.Section>
      </Fragment>
    );
  }

  renderPromoCodeField() {
    const { billing } = this.props;
    const { selectedPromo = {}} = billing;
    return (
      <Panel.Section>
        <PromoCode
          selectedPromo={selectedPromo}
        />
      </Panel.Section>
    );
  }

  render() {
    const { loading, plans, submitting, selectedPlan = {}} = this.props;

    if (loading) {
      return <Loading />;
    }

    const buttonText = submitting ? 'Updating Subscription...' : 'Get Started';

    return (
      <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <CenteredLogo />
        <Grid>
          <Grid.Column>
            <Panel title='Select A Plan'>
              <PlanPicker disabled={submitting} plans={plans} />
              {!selectedPlan.isFree && this.renderPromoCodeField()}
              <AccessControl condition={not(isAws)}>
                {this.renderCCSection()}
              </AccessControl>
              <Panel.Section>
                <Button disabled={submitting} primary={true} type='submit' size='large' fullWidth={true}>{buttonText}</Button>
              </Panel.Section>
              <Steps />
            </Panel>
          </Grid.Column>
        </Grid>
      </form>
    );
  }
}

const promoCodeValidate = (values, dispatch) => {
  const { promoCode, planpicker } = values;
  if (!promoCode) {
    return Promise.resolve();
  }

  return dispatch(
    verifyPromoCode({
      promoCode,
      billingId: planpicker.billingId,
      meta: { promoCode }
    })
  ).catch(({ message }) => {
    throw { promoCode: 'Invalid promo code' };
  });
};

const formOptions = { form: FORMS.JOIN_PLAN, enableReinitialize: true, asyncValidate: promoCodeValidate, asyncBlurFields: ['promoCode']};

export default connect(
  choosePlanMSTP(FORMS.JOIN_PLAN),
  { billingCreate, showAlert, getPlans, getBillingCountries }
)(reduxForm(formOptions)(OnboardingPlanPage));
