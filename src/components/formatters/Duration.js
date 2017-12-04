import React, { Fragment } from 'react';
import _ from 'lodash';

const formatDuration = (value) => {
  if (isNaN(parseFloat(value)) === true || isFinite(value) === false) {
    return value;
  }

  // Default case is milliseconds
  let formatted = value;
  let suffix = 'ms';

  const formatters = {
    'h': 3.6e+6,
    'm': 60000,
    's': 1000
  };

  _.forEach(formatters, (unit, key) => {
    if (value > unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${formatted.toFixed(2)} ${suffix}`;
};

// Formats milliseconds into a readable duration value
const Duration = ({ value }) => <Fragment>{ formatDuration(value) }</Fragment>;
Duration.displayName = 'Duration';

export {
  Duration,
  formatDuration
};
