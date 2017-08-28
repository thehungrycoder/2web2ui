const MILLION = Math.pow(10, 6);
const BILLION = Math.pow(10, 9);
const TRILLION = Math.pow(10, 12);

function roundToPlaces(number, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(number * multiplier) / multiplier;
}

function formatNumber(num) {
  if (num < 1000) {
    return num.toLocaleString();
  }
  if (num < MILLION) {
    return `${roundToPlaces(num / 1000, 1).toLocaleString()}K`;
  }
  if (num < BILLION) {
    return `${roundToPlaces(num / MILLION, 1).toLocaleString()}M`;
  }
  // otherwise convert to scientific notation
  return num.toPrecision(2);
}

function formatMilliseconds(amount) {
  if (amount < 1000) {
    return `${amount}ms`;
  }
  if (amount < 60000) {
    return `${roundToPlaces(amount / 1000, 1).toLocaleString()}s`;
  }

  return `${roundToPlaces(amount / 60000, 1).toLocaleString()}min`;
}

function formatBytes(amount) {
  if (amount < 1000) {
    return `${amount}B`;
  }
  if (amount < MILLION) {
    return `${roundToPlaces(amount / 1000, 1).toLocaleString()}KB`;
  }
  if (amount < BILLION) {
    return `${roundToPlaces(amount / MILLION, 1).toLocaleString()}MB`;
  }
  if (amount < TRILLION) {
    return `${roundToPlaces(amount / BILLION, 1).toLocaleString()}GB`;
  }

  return `${roundToPlaces(amount / TRILLION, 1).toLocaleString()}TB`;
}

export default {
  number: {
    label: 'Count',
    yAxisFormatter: formatNumber
  },
  percent: {
    label: 'Percent',
    yAxisFormatter: (v) => `${roundToPlaces(v, 1)}%`
  },
  milliseconds: {
    label: 'Time',
    yAxisFormatter: formatMilliseconds
  },
  bytes: {
    label: 'Size, in Bytes',
    yAxisFormatter: formatBytes
  }
};
