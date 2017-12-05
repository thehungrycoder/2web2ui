import React, { Fragment } from 'react';
import _ from 'lodash';

const formatSize = (value) => {
  if (isNaN(parseFloat(value)) === true || isFinite(value) === false) {
    return value;
  }

  // Default case is Bytes
  let formatted = value;
  let suffix = 'B';

  const formatters = {
    'PB': 1.126e+15,
    'TB': 1.1e+12,
    'GB': 1.074e+9,
    'MB': 1.049e+6,
    'KB': 1024
  };

  _.forEach(formatters, (unit, key) => {
    if (value > unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${formatted.toFixed(2)}${suffix}`;
};

// Formats bytes into a readable size value
const Size = ({ value }) => <Fragment>{ formatSize(value) }</Fragment>;
Size.displayName = 'Size';

export {
  Size,
  formatSize
};
