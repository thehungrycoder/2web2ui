import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';
import {
  TextFieldWrapper,
  CheckboxWrapper,
  RadioGroup,
  PoolTypeaheadWrapper
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

const keyBoxHelpText = (createApiKey) => createApiKey
    ? 'The key will only be shown once when created, so be sure to copy and save it somewhere safe.'
    : 'Every subaccount you create will need its own API key. You can create one later.';

const apiKeyFields = (showGrants = false, grants) => (
  <div>
    <Field
      name="keyName"
      component={TextFieldWrapper}
      label="Key Name"
      validate={required}
    />
    <Field
      name="grantsRadio"
      component={RadioGroup}
      title="API Permissions"
      options={grantsOptions}
    />
    <GrantsCheckboxes grants={grants} show={showGrants} />
    <Field
      name="validIps"
      component={TextFieldWrapper}
      label="Allowed IPs"
      helpText="Leaving the field blank will allow access by valid API keys from any IP address."
      placeholder="10.20.30.40, 10.20.30.0/24"
      validate={ipValidator}
    />
  </div>
);

const ipPoolFields = (assingToPool, ipPools) => (
  <Field
    name="ipPool"
    component={PoolTypeaheadWrapper}
    pools={ipPools}
    label="IP Pool"
  />
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
      createApiKey,
      ipPools,
      assingToPool
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
          />
        </Panel.Section>
        <Panel.Section>
          <Field
            name="createApiKey"
            component={CheckboxWrapper}
            type="checkbox"
            label="Create API Key"
            helpText={ keyBoxHelpText(createApiKey) }
          />
          { createApiKey && apiKeyFields(showGrants, grants) }
        </Panel.Section>
        { hasIpPools &&
          <Panel.Section>
            <Field
              name="assingToPool"
              component={CheckboxWrapper}
              type="checkbox"
              label="Assign to IP Pool"
              helpText={ 'You can do this later' }
            />
            { assingToPool && ipPoolFields(assingToPool, ipPools) }
          </Panel.Section>
        }
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
  grants: getSubaccountGrants(state),
  createApiKey: valueSelector(state, 'createApiKey'),
  assingToPool: valueSelector(state, 'assingToPool'),
  showGrants: valueSelector(state, 'grantsRadio') === 'select',
  ipPools: state.ipPools.list,
  initialValues: {
    grantsRadio: 'all',
    createApiKey: true
  }
});

const SubaccountReduxForm = reduxForm({ form: formName })(SubaccountForm);
export default connect(mapStateToProps, {})(SubaccountReduxForm);
