import _ from 'lodash';

const MILLION = Math.pow(10, 6);
const BILLION = Math.pow(10, 9);
const TRILLION = Math.pow(10, 12);
const QUARDRILLION = Math.pow(10, 15);

export const isNumber = (value) => isNaN(parseFloat(value)) === false || isFinite(value) === true;

export function roundToPlaces(number, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(number * multiplier) / multiplier;
}

// Formats bytes into a readable size value
export const formatBytes = (value) => {
  if (!isNumber(value)) {
    return value;
  }

  // Default case is Bytes
  let formatted = value;
  let suffix = 'B';

  const formatters = {
    'PB': QUARDRILLION,
    'TB': TRILLION,
    'GB': BILLION,
    'MB': MILLION,
    'KB': 1000
  };

  _.forEach(formatters, (unit, key) => {
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString()}${suffix}`;
};

// Formats milliseconds into a readable duration value
export const formatMilliseconds = (value) => {
  if (!isNumber(value)) {
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
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString()}${suffix}`;
};

// Formats number count into a abbreviated count
export const formatNumber = (value) => {
  if (!isNumber(value)) {
    return value;
  }

  if (!isFinite(value)) {
    value = 0;
  }

  // No suffix for default case
  let formatted = value;
  let suffix = '';

  const formatters = {
    'M': MILLION,
    'K': 1000
  };

  _.forEach(formatters, (unit, key) => {
    if (value >= unit) {
      suffix = key;
      formatted = value / unit;
      return false;
    }
  });

  return `${roundToPlaces(formatted, 2).toLocaleString()}${suffix}`;
};

// Formats number count to sting with commas
export const formatFullNumber = (value) => {
  if (!isNumber(value)) {
    return value;
  }

  return value.toLocaleString();
};

export const formatPercent = (value) => {
  if (!isNumber(value)) {
    return value;
  }

  if (!isFinite(value)) {
    value = 0;
  }

  let formatted = `${roundToPlaces(value, 2)}%`;

  if (value < 0.01 && value > 0) {
    formatted = '< 0.01%';
  }

  return formatted;
};
