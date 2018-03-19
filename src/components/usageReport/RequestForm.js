import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, integer, minNumber, minLength } from 'src/helpers/validation';
import styles from './UsageReport.module.scss';

const formName = 'dailyLimitIncreaseRequestForm';

export class RequestForm extends Component {
  render() {
    const { onSubmit, handleSubmit, onCancel, submitting, pristine, invalid, currentLimit = 1 } = this.props;

    return (<div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Section>
          <p><strong>Please note this process may take up to 2 business days.</strong></p>

          <Field
            name='dailyLimit'
            label='Daily Limit'
            inlineErrors={true}
            disabled={submitting}
            validate={[required, integer, minNumber(currentLimit)]}
            component={TextFieldWrapper}
            required={true}
          />

          <Field
            multiline
            rows={4}
            resize='none'
            name='reason'
            label='Reason for Increase?'
            inlineErrors={true}
            disabled={submitting}
            required={true}
            validate={[required, minLength(5)]}
            component={TextFieldWrapper}
          />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={pristine || invalid || submitting}>
            {submitting ? 'Submitting' : 'Request Limit Increase' }
          </Button>
          <Button disabled={submitting} onClick={onCancel} className={styles.CloseButton}>
            Close
          </Button>
        </Panel.Section>
      </form>
    </div>);
  }
}

const ReduxForm = reduxForm({ form: formName })(RequestForm);
export default ReduxForm;


