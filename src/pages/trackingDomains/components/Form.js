import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Panel, Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required } from 'src/helpers/validation';
import { SubaccountTypeaheadWrapper } from 'src/components/reduxFormWrappers';

export const FORM_NAME = 'createTrackingDomain';
const formOptions = {
  form: FORM_NAME
};

export class CreateTrackingDomainForm extends Component {

  render() {
    const { submitting, handleSubmit } = this.props;

    return (
      <Panel sectioned>
        <form onSubmit={handleSubmit}>
          <Panel.Section>
            <Field
              component={TextFieldWrapper}
              label='Domain Name'
              name='domain'
              validate={required}
            />
            <Field
              component={SubaccountTypeaheadWrapper}
              label='Assign to Subaccount'
              name='subaccount'
            />
            <Button submit primary={true} disabled={submitting}>Add Tracking Domain</Button>
          </Panel.Section>
        </form>
      </Panel>
    );
  }
}

export default reduxForm(formOptions)(CreateTrackingDomainForm);
