import React from 'react';
import { Field } from 'redux-form';
import { required, maxLength } from 'src/helpers/validation';
import { TextFieldWrapper, SelectWrapper, RadioGroup, CheckboxWrapper } from 'src/components';
import { UnstyledLink } from '@sparkpost/matchbox';

const BasicAuthFields = () => (
  <div>
  Basic Auth
    <Field name='basicUser' label='Username' placeholder='username' component={TextFieldWrapper} validate={required}/>
    <Field name='basicPass' label='Password' placeholder='password' component={TextFieldWrapper} validate={required}/>
  </div>
);

const OAuth2Fields = () => (
  <div>
  OAuth 2.0
    <Field name='clientId' label='Client ID' placeholder='clientID' component={TextFieldWrapper} validate={required}/>
    <Field name='clientSecret' label='Client Secret' placeholder='clientSecret' component={TextFieldWrapper} validate={required}/>
    <Field name='tokenURL' label='Token URL' placeholder='https://www.example.com/tokens/' component={TextFieldWrapper} validate={required}/>
  </div>
);

const NameField = () => (
  <Field
    name='name'
    component={TextFieldWrapper}
    validate={[required, maxLength(24)]}
    label='Webhook Name'
    placeholder='e.g. My Opens and Clicks Webhook'
    helpText='A friendly label for your webhook, only used for display'
  />
);

const TargetField = () => (
  <Field
    name='target'
    component={TextFieldWrapper}
    validate={required}
    label='Target'
    placeholder='https://example.com/webhook-target'
    helpText="This is the URL we'll send data to. We recommend the use of https."
  />
);

const EventsRadioGroup = () => (
  <Field
    name='eventsRadio'
    component={RadioGroup}
    title='Events:'
    options={[
      { value: 'all', label: 'All' },
      { value: 'select', label: 'Select' }
    ]}
  />
);

const AuthDropDown = () => (
  <Field
    name='auth'
    label='Authentication'
    component={SelectWrapper}
    options={[{ value: '', label: 'None' }, { value: 'basic', label: 'Basic Auth' }, { value: 'oauth2', label: 'OAuth 2.0' }]}
    helpText={<span>Select "None" if your target URL has no authentication scheme. <UnstyledLink external to='https://support.sparkpost.com/customer/portal/articles/2112385'>More information</UnstyledLink>.</span>}
  />
);

const ActiveField = () => {
  // Artificially set a checked prop so the underlying input displays properly.
  const CheckableCheckbox = ({ input, ...rest }) => <CheckboxWrapper input={input} {...rest} checked={Boolean(input.value)} />;
  return <Field
    name='active'
    label='Active'
    component={CheckableCheckbox}
    helpText='An inactive webhook will not transmit any data.'
  />;
};

export {
  NameField,
  TargetField,
  EventsRadioGroup,
  AuthDropDown,
  BasicAuthFields,
  OAuth2Fields,
  ActiveField
};
