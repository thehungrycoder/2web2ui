import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Panel, Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, domain } from 'src/helpers/validation';
import { SubaccountTypeaheadWrapper } from 'src/components/reduxFormWrappers';

export class CreateForm extends Component {

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
              validate={[required, domain]}
              disabled={submitting}
            />
            <Field
              component={SubaccountTypeaheadWrapper}
              label='Assign to Subaccount'
              name='subaccount'
              disabled={submitting}
            />
            <Button submit primary={true} disabled={submitting}>{submitting ? 'Submitting...' : 'Add Tracking Domain'}</Button>
          </Panel.Section>
        </form>
      </Panel>
    );
  }
}

const formOptions = {
  form: 'createTrackingDomain'
};

export default reduxForm(formOptions)(CreateForm);
