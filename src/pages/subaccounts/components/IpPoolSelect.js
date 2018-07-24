import React from 'react';
import { Field } from 'redux-form';
import SelectWrapper from 'src/components/reduxFormWrappers/SelectWrapper';
import { required } from 'src/helpers/validation';

export default function IpPoolSelect({ disabled, options }) {
  const formattedOptions = options.map(({ id, name }) => ({
    label: `${name} (id: ${id})`,
    value: id
  }));

  return (
    <Field
      name="ipPool"
      component={SelectWrapper}
      label="IP Pool"
      options={formattedOptions}
      disabled={disabled}
      placeholder=" "
      required={true}
      validate={required}
    />
  );
}
