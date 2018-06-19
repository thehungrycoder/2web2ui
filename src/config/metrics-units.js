import {
  formatBytes,
  formatMilliseconds,
  formatNumber
} from 'src/helpers/units';

import { formatYAxisPercent } from 'src/helpers/chart';

export default {
  number: {
    label: 'Count',
    yAxisFormatter: formatNumber
  },
  percent: {
    label: 'Percent',
    yAxisFormatter: formatYAxisPercent
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
