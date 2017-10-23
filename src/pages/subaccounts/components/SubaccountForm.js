import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper, CheckboxWrapper, RadioGroup } from 'src/components/reduxFormWrappers';
import ipValidator from '../helpers/ipValidator';
import GrantsCheckboxes from 'src/components/grantBoxes/GrantsCheckboxes';

import {
  getGrants
} from 'src/selectors/api-keys';


const formName = 'SubaccountForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];


const apiKeyFields = (showGrants = false, grants) => (
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
      name="grantsRadio"
      component={RadioGroup}
      title="API Permissions"
      options={grantsOptions}
    />
    <GrantsCheckboxes grants={grants} show={true} />
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
      showGrants,
      grants,
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
        { createAPIKey && apiKeyFields(showGrants, grants) }
        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            Create
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, props) => ({
  grants: getGrants(state),
  createAPIKey: valueSelector(state, 'apiKeyCheckbox'),
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  initialValues: {
    grantsRadio: 'all',
    apiKeyCheckbox: true
  }
});

const SubaccountReduxForm = reduxForm({ form: formName })(SubaccountForm);
export default connect(mapStateToProps, {})(SubaccountReduxForm);
