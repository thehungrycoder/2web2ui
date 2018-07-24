import React from 'react';
import { Field } from 'redux-form';
import CheckboxWrapper from 'src/components/reduxFormWrappers/CheckboxWrapper';

export default function RestrictToIpPoolCheckbox({ disabled }) {
  return (
    <Field
      name="restrictedToIpPool"
      component={CheckboxWrapper}
      type="checkbox"
      label="Restrict traffic to a single IP Pool"
      disabled={disabled}
    />
  );
}
