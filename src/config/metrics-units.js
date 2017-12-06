import {
  formatBytes,
  formatMilliseconds,
  formatNumber,
  roundToPlaces
} from 'src/helpers/units';

export default {
  number: {
    label: 'Count',
    yAxisFormatter: formatNumber
  },
  percent: {
    label: 'Percent',
    yAxisFormatter: (v) => v < 1 ? `${roundToPlaces(v, 2)}%` : `${roundToPlaces(v, 1)}%`
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
