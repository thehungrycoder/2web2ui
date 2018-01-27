import React from 'react';
import PoolTypeahead from '../ipPoolTypeahead/PoolTypeahead';

export default function PoolTypeaheadWrapper({ input, pools }) {
  return (
    <PoolTypeahead
      name={input.name}
      onChange={input.onChange}
      selectedItem={input.value}
      pools={pools}
    />
  );
}
