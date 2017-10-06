import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { updateBillingContact } from 'src/actions/billing';
import { showAlert } from 'src/actions/globalAlert';
import { updateContactInitialValues } from 'src/selectors/accountBillingForms';

import { Panel, Button } from '@sparkpost/matchbox';
import BillingContactForm from './forms/BillingContactForm';

import styles from './formContainers.module.scss';

const FORMNAME = 'updateContact';

class UpdateContact extends Component {

  onSubmit = (values) => {
    const { updateBillingContact, onCancel, reset, showAlert } = this.props;
    return updateBillingContact(values).then(() => {
      showAlert({ type: 'success', message: 'Billing Contact Updated' });
      onCancel();
      reset();
    }).catch((err) => showAlert({ type: 'error', message: 'Billing Contact Update Failed' }));
  }

  render() {
    const { onCancel, handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit((values) => this.onSubmit(values))}>
        <Panel title='Update Billing Contact'>
          <Panel.Section>
            <BillingContactForm
              formName={FORMNAME}
              disabled={submitting}
              countries={this.props.billing.countries} />
          </Panel.Section>
          <Panel.Section>
            <Button type='submit' primary disabled={submitting}>Update Billing Contact</Button>
            <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  billing: state.billing,
  initialValues: updateContactInitialValues(state)
});

const mapDispatchtoProps = { updateBillingContact, showAlert };
const formOptions = { form: FORMNAME, enableReinitialize: true };
export default connect(mapStateToProps, mapDispatchtoProps)(reduxForm(formOptions)(UpdateContact));
