import React from 'react';
import { TextField, Icon } from '@sparkpost/matchbox';

export default function CollectionFilter({ onChange, rows, exampleModifiers = Object.keys(rows[0]) }) {
  function handleChange(e) {
    onChange(e.target.value);
  }

  const first = exampleModifiers[0];
  const second = exampleModifiers[1] || first;
  const placeholder = `Filter results by ${exampleModifiers.slice(0, 3).join(', ')}, etc...`;
  const helpText = <span>Advanced filtering: try using modifiers such as <strong>{first}:some-{first}</strong> or <strong>{second}:&#8220;some {second}&#8221;</strong></span>;

  return (
    <TextField prefix={<Icon name='Search' />} placeholder={placeholder} helpText={helpText} onChange={handleChange} />
  );
}
