import React from 'react';
import _ from 'lodash';
import { Button } from '@sparkpost/matchbox';

export default function DeleteButton({ disabled = false, name = null, onClick = _.noop }) {
  // Display nothing when disabled
  if (disabled) { return null; }

  const handleClick = (event) => { onClick(name); };

  return (
    <Button name={name} onClick={handleClick}>
      Delete
    </Button>
  );
}
