import React from 'react';
import { TextField } from '@sparkpost/matchbox';

// Wrapped matchbox components for use with react-redux Field components
export default function TextFieldWrapper({ input, meta, ...rest }) {
  const { active, error, touched } = meta;

  return (
    <TextField
      id={input.name}
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
}
