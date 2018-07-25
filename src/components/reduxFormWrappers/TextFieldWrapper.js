import React from 'react';
import { TextField } from '@sparkpost/matchbox';

// Wrapped matchbox components for use with react-redux Field components
export default function TextFieldWrapper({ input, meta, ...rest }) {
  const { active, error, touched } = meta;

  const defaultResize = rest.multiline ? 'vertical' : 'both';

  return (
    <TextField
      id={input.name}
      {...input}
      error={!active && touched && error ? error : undefined}
      resize={defaultResize} //can be overridden by passing same prop explicitly
      {...rest}
    />
  );
}
