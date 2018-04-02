import React from 'react';
import { TextField, Icon, Panel } from '@sparkpost/matchbox';
import _ from 'lodash';

export default function CollectionFilterBox({ onChange, rows, exampleModifiers = Object.keys(rows[0]), keyMap = {}}) {
  function handleChange(e) {
    onChange(e.target.value);
  }

  const exampleString = exampleModifiers.reduce((examples, modifier) => {
    const realKey = keyMap[modifier] || modifier;
    const rowWithValue = _.find(rows, realKey) || {};
    const value = rowWithValue[realKey];
    return [ ...examples, `${modifier}:${value}` ];
  }, []).join(' ');
  const placeholder = `Filter results e.g. ${exampleString}`;

  return (
    <Panel sectioned>
      <TextField prefix={<Icon name='Search' />} placeholder={placeholder} onChange={handleChange} />
    </Panel>
  );
}
