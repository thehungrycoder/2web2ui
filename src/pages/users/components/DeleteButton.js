import React from 'react';
import fp from 'lodash/fp';
import { Button, Icon } from '@sparkpost/matchbox';

export default function DeleteButton({ disabled = false, name = null, onClick = fp.noop }) {
  // Display nothing when disabled to match current UI style
  if (disabled) { return null; }

  const handleClick = (event) => { onClick(name); };

  return (
    <Button plain name={name} onClick={handleClick}>
      <Icon name="Delete"/>
    </Button>
  );
}
