import React, { Fragment } from 'react';
import { Duration, Size, Percent, Count } from 'src/components';
import { isNumber } from 'src/helpers/units';

const formatUnit = (value, unit) => {
  if (typeof value === 'undefined') {
    return '';
  }

  if (!isNumber(value)) {
    return value;
  }

  if (unit === 'bytes') {
    return <Size value={value} />;
  }

  if (unit === 'milliseconds') {
    return <Duration value={value} />;
  }

  if (unit === 'percent') {
    return <Percent value={value} />;
  }

  if (unit === 'number') {
    return <Count value={value} />;
  }

  return value.toLocaleString();
};

// Formats numerical value to a readable format for its provided unit
const Unit = ({ value, unit }) => <Fragment>{ formatUnit(value, unit) }</Fragment>;
Unit.displayName = 'Unit';

export {
  Unit,
  formatUnit
};
