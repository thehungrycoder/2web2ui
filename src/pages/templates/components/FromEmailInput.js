import React from 'react';
import { TextField } from '@sparkpost/matchbox';

// note, do not override value, let Downshift control it (provided by getInputProps)
// note, do not override onChange, it is needed to update the redux store
const FromEmailInput = ({ downshift: { getInputProps, isOpen }, error, value, ...rest }) => {
  const props = getInputProps({
    ...rest,
    error: !isOpen && error ? error : undefined
  });

  return <TextField {...props} />;
};

export default FromEmailInput;
