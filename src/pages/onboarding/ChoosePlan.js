import React, { Component, Fragment } from 'react';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { CenteredLogo, Loading, PlanPicker } from 'src/components';
import Steps from './components/Steps';
import { getPlans } from 'src/actions/account';
import { getBillingCountries, billingCreate, updateSubscription } from 'src/actions/billing';
import { getPlansSelector, isAWSAccountSelector } from 'src/selectors/accountBillingInfo';
import { onboardingInitialValues } from 'src/selectors/accountBillingForms';
import PaymentForm from 'src/pages/billing/forms/fields/PaymentForm';
import BillingAddressForm from 'src/pages/billing/forms/fields/BillingAddressForm';

const FORM_NAME = 'selectInitialPlan';
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
    const { billingCreate, showAlert, history, isAWSAccount } = this.props;

    // no billing updates needed since they are still on free plan
    if (values.planpicker.isFree) {
      history.push(NEXT_STEP);
      return;
    }

    const promise = isAWSAccount
      ? this.props.updateSubscription({ code: values.planpicker.code, isAWSAccount })
      : billingCreate(values);

    return promise
      .then(() => history.push(NEXT_STEP))
      .then(() => showAlert({ type: 'success', message: 'Added your plan' }));
  };

  renderCCSection = () => {
    const { billing, submitting, selectedPlan = {}} = this.props;

    if (selectedPlan.isFree) {
      return (
        <Panel.Section>
          <p>Our full-featured, free account designed for developers:</p>
          <ul>
            <li>Up to 15,000 free messages per month, forever.</li>
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
            formName={FORM_NAME}
            disabled={submitting}
          />
        </Panel.Section>
        <Panel.Section>
          <BillingAddressForm
            formName={FORM_NAME}
            disabled={submitting}
            countries={billing.countries}
          />
        </Panel.Section>
      </Fragment>
    );
  }

  render() {
    const { loading, plans, submitting, isAWSAccount } = this.props;

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
              {!isAWSAccount && this.renderCCSection()}
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

const mapStateToProps = (state) => {
  const selector = formValueSelector(FORM_NAME);
  return {
    loading: Boolean(state.account.loading || state.billing.plansLoading || state.billing.countriesLoading),
    billing: state.billing,
    plans: getPlansSelector(state),
    initialValues: onboardingInitialValues(state),
    selectedPlan: selector(state, 'planpicker'),
    hasError: state.billing.plansError || state.billing.countriesError,
    isAWSAccount: isAWSAccountSelector(state)
  };
};
const mapDispatchToProps = { billingCreate, showAlert, getPlans, getBillingCountries, updateSubscription };
const formOptions = { form: FORM_NAME, enableReinitialize: true };

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm(formOptions)(OnboardingPlanPage));
