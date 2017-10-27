import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import {
  TextFieldWrapper,
  CheckboxWrapper,
  RadioGroup,
  SelectWrapper
} from 'src/components/reduxFormWrappers';
import ipValidator from '../helpers/ipValidator';
import { required } from 'src/helpers/validation';
import GrantsCheckboxes from 'src/components/grantBoxes/GrantsCheckboxes';

import { getSubaccountGrants } from 'src/selectors/api-keys';

const formName = 'SubaccountForm';
const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

const ipPoolsSelectOptions = (ipPools) => (ipPools.map((pool) => ({
  value: pool.id,
  label: pool.name
})));

const keyBoxHelpText = (createApiKey) => createApiKey
    ? 'The key will only be shown once when created, so be sure to copy and save it somewhere safe.'
    : 'Every subaccount you create will need its own API key. You can create one later.';

const apiKeyFields = (showGrants = false, grants, submitting) => (
  <div>
    <Field
      name="keyName"
      component={TextFieldWrapper}
      label="Key Name"
      validate={required}
      disabled={submitting}
    />
    <Field
      name="grantsRadio"
      component={RadioGroup}
      title="API Permissions"
      options={grantsOptions}
      disabled={submitting}
    />
    <GrantsCheckboxes grants={grants} show={showGrants} />
    <Field
      name="validIps"
      component={TextFieldWrapper}
      label="Allowed IPs"
      helpText="Leaving the field blank will allow access by valid API keys from any IP address."
      placeholder="10.20.30.40, 10.20.30.0/24"
      validate={ipValidator}
      disabled={submitting}
    />
  </div>
);

const ipPoolFields = (ipPools, submitting) => (
  <Field
    name="ipPool"
    component={SelectWrapper}
    options={ipPoolsSelectOptions(ipPools)}
    label="IP Pool"
    disabled={submitting}
  />
);

export class SubaccountForm extends Component {

  render() {
    const {
      handleSubmit,
      pristine,
      showGrants,
      grants,
      submitting,
      createApiKey,
      ipPools
    } = this.props;

    const hasIpPools = !!ipPools.length;

    return (
      <form onSubmit={handleSubmit}>
        <Panel.Section>
          <Field
            name="name"
            component={TextFieldWrapper}
            label="Name"
            validate={required}
            disabled={submitting}
          />
        </Panel.Section>
        <Panel.Section>
          <Field
            name="createApiKey"
            component={CheckboxWrapper}
            type="checkbox"
            label="Create API Key"
            helpText={ keyBoxHelpText(createApiKey) }
            disabled={submitting}
          />
          { createApiKey && apiKeyFields(showGrants, grants, submitting) }
        </Panel.Section>
        { hasIpPools &&
          <Panel.Section>
            { ipPoolFields(ipPools, submitting) }
          </Panel.Section>
        }
        <Panel.Section>
          <Button submit primary disabled={submitting || pristine}>
            { submitting ? 'Loading...' : 'Create' }
          </Button>
        </Panel.Section>
      </form>
    );
  }
}

const valueSelector = formValueSelector(formName);

const mapStateToProps = (state, props) => ({
  grants: getSubaccountGrants(state),
  createApiKey: valueSelector(state, 'createApiKey'),
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  ipPools: state.ipPools.list,
  initialValues: {
    grantsRadio: 'all',
    createApiKey: true,
    ipPool: 'default'
  }
});

const SubaccountReduxForm = reduxForm({ form: formName })(SubaccountForm);
export default connect(mapStateToProps, {})(SubaccountReduxForm);
