import React, { Fragment } from 'react';

const formatPercent = (value) => {
  if (isNaN(parseFloat(value)) === true || isFinite(value) === false) {
    return value;
  }

  let formatted = `${value.toFixed(2)}%`;

  if (value < 0.01 && value > 0) {
    formatted = '< 0.01%';
  }

  return formatted;
};

const Percent = ({ value }) => <Fragment>{ formatPercent(value) }</Fragment>;
Percent.displayName = 'Percent';

export {
  Percent,
  formatPercent
}
