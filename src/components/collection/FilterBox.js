import React from 'react';
import { TextField, Icon, Panel } from '@sparkpost/matchbox';
import { getRandomExampleSearch } from './helpers/exampleSearch';

export default function CollectionFilterBox(props) {
  const placeholder = `Filter results e.g. ${getRandomExampleSearch(props)}`;

  return (
    <Panel sectioned>
      <TextField
        prefix={<Icon name='Search' />}
        placeholder={placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </Panel>
  );
}
