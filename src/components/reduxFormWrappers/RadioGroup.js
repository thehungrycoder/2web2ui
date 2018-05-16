import React from 'react';
import { Radio, Label, Error } from '@sparkpost/matchbox';

export default function RadioGroup ({ input, options, title, meta }) {
  const { error, touched } = meta;

  return (
    <Radio.Group>
      <Label>{title}{touched && error ? <Error error={error}/> : ''}</Label>
      {options.map((o) => (
        <Radio
          key={`${input.name}-${o.value}`}
          {...input}
          id={`${input.name}-${o.value}`}
          label={o.label}
          checked={o.value === input.value}
          disabled={!!o.disabled}
          value={o.value}
        />
      ))}
    </Radio.Group>
  );
}
