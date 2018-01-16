import moment from 'moment';

export const relativeDateOptions = [
  { value: 'hour', label: 'Last Hour' },
  { value: 'day', label: 'Last 24 Hours' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
  { value: '90days', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom' }
];

export const relativeDateOptionsIndexed = relativeDateOptions.reduce((result, { value, label }) => {
  result[value] = label;
  return result;
}, {});

export function getEndOfDay(date) {
  const end = new Date(date);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(0);

  return end;
}

export function getStartOfDay(date) {
  const start = new Date(date);
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);

  return start;
}

export function getRelativeDates(range) {
  const now = moment.utc();
  const to = now.toDate();

  switch (range) {
    case 'hour':
      return { to, from: moment(to).subtract(1, 'hour').toDate() };

    case 'day':
      return { to, from: moment(to).subtract(1, 'day').toDate() };

    case '7days':
      return { to, from: moment(to).subtract(7, 'day').toDate() };

    case '30days':
      return { to, from: moment(to).subtract(30, 'day').toDate() };

    case '90days':
      return { to, from: moment(to).subtract(90, 'day').toDate() };

    default:
      return {};
  }
}
