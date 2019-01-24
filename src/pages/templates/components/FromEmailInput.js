import React from 'react';
import { TextField } from '@sparkpost/matchbox';

const FromEmailInput = ({ downshift: { getInputProps, isOpen }, error, ...rest }) => {
  const props = getInputProps({
    ...rest,
    error: !isOpen && error ? error : undefined
  });

  return <TextField {...props} />;
};

export default FromEmailInput;
