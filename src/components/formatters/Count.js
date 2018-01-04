import React, { Fragment } from 'react';
import { formatNumber } from 'src/helpers/units';

// Formats count into an abbreviated value
const Count = ({ value }) => <Fragment>{ formatNumber(value) }</Fragment>;
Count.displayName = 'Count';

export {
  Count
};
