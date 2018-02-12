import React from 'react';
import { Radio } from '@sparkpost/matchbox';

export default function RadioGroup({ input, options, title }) {
  return (
    <Radio.Group>
      {title}
      {options.map((o) => (
        <Radio
          key={o.label}
          {...input}
          id={o.label}
          label={o.label}
          checked={o.value === input.value}
          disabled={!!o.disabled}
          value={o.value}
        />
      ))}
    </Radio.Group>
  );
}
