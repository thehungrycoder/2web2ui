import React from 'react';
import { Select } from '@sparkpost/matchbox';

export default function SelectWrapper({ input, meta, ...rest }) {
  const { active, error, touched } = meta;

  return (
    <Select
      id={input.name}
      {...input}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
}
