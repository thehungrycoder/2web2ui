/* eslint-disable */
import React, { Fragment } from 'react';
import { Duration, Size, Percent } from 'src/components';

export const formatUnit = (value, unit) => {
  if (typeof value === 'undefined') {
    return '';
  }

  if (isNaN(parseFloat(value)) === true || isFinite(value) === false) {
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

  return value.toLocaleString();
};

// Formats numerical value to a readable format for its provided unit
export const Unit = ({ value, unit }) => {
  
  return <Fragment>{ formatUnit(value, unit) }</Fragment>;
}
