import React from 'react';
import { TextField, Panel } from '@sparkpost/matchbox';
import { Search } from '@sparkpost/matchbox-icons';
import { getRandomExampleSearch } from './helpers/exampleSearch';

export default function CollectionFilterBox(props) {
  const placeholder = `Filter results e.g. ${getRandomExampleSearch(props)}`;

  return (
    <Panel sectioned>
      <TextField
        prefix={<Search />}
        placeholder={placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </Panel>
  );
}
