import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components/reduxFormWrappers';
import ipValidator from '../helpers/ipValidator';

const FORMNAME = 'SubaccountForm';

const apiKeyFields = () => (
  <Panel.Section>
    <p>
      API Key <br/>
      <small>The key will only show once when created, so be sure to copy and save it somewhere safe.</small>
    </p>
    <Field
      name="keyName"
      component={TextFieldWrapper}
      label="Key Name"
    />
    <Field
      name="keyPermissions"
      component={TextFieldWrapper}
      label="Key Permissions"
    />
    <Field
      name="validIps"
      component={TextFieldWrapper}
      label="Allowed IPs"
      helpText="Leaving the field blank will allow access by valid API keys from any IP address."
      placeholder="10.20.30.40, 10.20.30.0/24"
      validate={ipValidator}
    />
  </Panel.Section>
);

export class SubaccountForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      // submitSucceeded,
      submitting,
      createAPIKey
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Field
            name="name"
            component={TextFieldWrapper}
            label="Name"
          />
          <Field
            name="ipPool"
            component={TextFieldWrapper}
            placeholder="Search for IP Pools"
            label="IP Pool"
          />
          <Field
            name="apiKeyCheckbox"
            component={CheckboxWrapper}
            type="checkbox"
            label="Create API Key"
            helpText={ !createAPIKey ? 'Every subaccount you create will need its own API key.' : '' }
          />
        </Panel.Section>
        { createAPIKey && apiKeyFields() }
        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            Create
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const valueSelector = formValueSelector(FORMNAME);

const mapStateToProps = (state, props) => ({
  createAPIKey: valueSelector(state, 'apiKeyCheckbox'),
  initialValues: {
    apiKeyCheckbox: true
  }
});

const SubaccountReduxForm = reduxForm({ form: FORMNAME })(SubaccountForm);
export default connect(mapStateToProps, {})(SubaccountReduxForm);
