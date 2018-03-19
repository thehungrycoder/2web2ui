import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Button, Panel, Banner } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, integer, minNumber, minLength } from 'src/helpers/validation';

const formName = 'dailyLimitIncreaseRequestForm';

export class RequestForm extends Component {
  render() {
    const { onSubmit, handleSubmit, onCancel, submitting, pristine, invalid, currentLimit = 1 } = this.props;

    return (<div>
      <Panel.Section>
        <h6>
          Request Daily Limit Increase
        </h6>
        <Banner status='info'>
          <p>Please note this process may take up to 2 business days.</p>
        </Banner>

      </Panel.Section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel.Section>
          <Field
            name='daily_limit'
            label='Daily Limit'
            inlineErrors={true}
            disabled={submitting}
            validate={[required, integer, minNumber(currentLimit)]}
            component={TextFieldWrapper}
            required={true}
          />

          <Field
            multiline
            rows={10}
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
          { ' '}
          <Button disabled={submitting} onClick={onCancel}>
            Cancel
          </Button>
        </Panel.Section>
      </form>
    </div>);
  }
}

const ReduxForm = reduxForm({ form: formName })(RequestForm);
export default ReduxForm;


