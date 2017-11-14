import React from 'react';
import { Field } from 'redux-form';
import { required } from 'src/helpers/validation';
import ipValidator from '../helpers/ipValidator';
import { TextFieldWrapper, CheckboxWrapper, RadioGroup, SelectWrapper } from 'src/components/reduxFormWrappers';
import GrantsCheckboxes from 'src/components/grantBoxes/GrantsCheckboxes';

const keyBoxHelpText = (createApiKey) => createApiKey
    ? 'The key will only be shown once when created, so be sure to copy and save it somewhere safe.'
    : 'Every subaccount you create will need its own API key. You can create one later.';

const ipPoolsOptions = (ipPools) => (ipPools.map(({ id, name }) => ({
  value: id,
  label: `${name} (id: ${id})`
})));

const statusOptions = [
  { value: 'active' , label: 'Active' },
  { value: 'suspended' , label: 'Suspended' },
  { value: 'terminated' , label: 'Terminated' }
];

const grantsOptions = [
  { value: 'all', label: 'All' },
  { value: 'select', label: 'Select' }
];

const NameField = ({ disabled }) => (
  <Field
    name="name"
    component={TextFieldWrapper}
    label="Name"
    validate={required}
    disabled={disabled}
  />
);

const ApiKeyCheckBox = ({ disabled, createApiKey }) => (
  <Field
    name="createApiKey"
    component={CheckboxWrapper}
    type="checkbox"
    label="Create API Key"
    helpText={ keyBoxHelpText(createApiKey) }
    disabled={disabled}
  />
);

const ApiKeyFields = ({ show, showGrants = false, grants, disabled }) => {
  if (!show) {
    return null;
  }

  return (
    <div>
      <Field
        name="keyName"
        component={TextFieldWrapper}
        label="Key Name"
        validate={required}
        disabled={disabled}
      />
      <Field
        name="grantsRadio"
        component={RadioGroup}
        title="API Permissions"
        options={grantsOptions}
        disabled={disabled}
      />
      <GrantsCheckboxes grants={grants} show={showGrants} />
      <Field
        name="validIps"
        component={TextFieldWrapper}
        label="Allowed IPs"
        helpText="Leaving the field blank will allow access by valid API keys from any IP address."
        placeholder="10.20.30.40, 10.20.30.0/24"
        validate={ipValidator}
        disabled={disabled}
      />
    </div>
  );
};

const StatusSelect = ({ disabled, compliance }) => {
  if (compliance) {
    return (
      <Field
        name="status"
        component={TextFieldWrapper}
        label="Status"
        disabled={true}
        helpText={'System set statuses can\'t be edited'}
      />
    );
  } else {
    return (
      <Field
        name="status"
        component={SelectWrapper}
        options={statusOptions}
        label="Status"
        disabled={disabled}
      />
    );
  }
};


const IpPoolSelect = ({ ipPools, disabled }) => (
  <Field
    name="ipPool"
    component={SelectWrapper}
    options={ipPoolsOptions(ipPools)}
    label="IP Pool"
    disabled={disabled}
  />
);

export {
  NameField,
  ApiKeyCheckBox,
  ApiKeyFields,
  IpPoolSelect,
  StatusSelect
};
