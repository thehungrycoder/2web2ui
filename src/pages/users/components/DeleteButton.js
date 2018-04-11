import React from 'react';
import { Button } from '@sparkpost/matchbox';

function noop() {}

export default function DeleteButton({ disabled = false, name = null, onClick = noop }) {
  // Display nothing when disabled
  if (disabled) { return null; }

  const handleClick = (event) => { onClick(name); };

  return (
    <Button name={name} onClick={handleClick}>
      Delete
    </Button>
  );
}
