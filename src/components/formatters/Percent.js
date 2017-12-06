import React, { Fragment } from 'react';
import { formatPercent } from 'src/helpers/units';

const Percent = ({ value }) => <Fragment>{ formatPercent(value) }</Fragment>;
Percent.displayName = 'Percent';

export {
  Percent
};
