
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { getBillingCountries, billingUpdate } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { updatePaymentInitialValues } from 'src/selectors/accountBillingForms';

import { Panel, Button } from '@sparkpost/matchbox';
import PaymentForm from '../components/PaymentForm';
import BillingAddressForm from '../components/BillingAddressForm';

import styles from './formContainers.module.scss';

const FORMNAME = 'update-payment';

class UpdatePayment extends Component {
  componentDidMount() {
    this.props.getBillingCountries();
  }

  onSubmit = (values) => {
    const { billingUpdate, onCancel, reset, showAlert } = this.props;
    return billingUpdate(values).then(() => {
      showAlert({ type: 'success', message: 'Payment Information Updated' });
      onCancel();
      reset();
    }).catch((err) => showAlert({ type: 'error', message: 'Payment Information Update Failed' }));
  }

  render() {
    const { onCancel, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit((values) => this.onSubmit(values))}>
        <Panel title='Update Payment Information'>
          <Panel.Section>
            <PaymentForm
              formName={FORMNAME}
              disabled={submitting} />
            </Panel.Section>
          <Panel.Section>
            <BillingAddressForm
              formName={FORMNAME}
              disabled={submitting}
              countries={this.props.billing.countries} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={submitting}>Update Payment Information</Button>
            <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  billing: state.billing,
  initialValues: updatePaymentInitialValues(state)
});

const mapDispatchtoProps = { getBillingCountries, billingUpdate, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(UpdatePayment));
