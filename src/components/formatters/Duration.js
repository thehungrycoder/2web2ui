import React, { Fragment } from 'react';
import { formatMilliseconds } from 'src/helpers/units';

// Formats milliseconds into a readable duration value
const Duration = ({ value }) => <Fragment>{ formatMilliseconds(value) }</Fragment>;
Duration.displayName = 'Duration';

export {
  Duration
};
