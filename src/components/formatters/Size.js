import React, { Fragment } from 'react';
import { formatBytes } from 'src/helpers/units';

// Formats bytes into a readable size value
const Size = ({ value }) => <Fragment>{ formatBytes(value) }</Fragment>;
Size.displayName = 'Size';

export {
  Size
};
