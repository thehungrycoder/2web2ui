import moment from 'moment';
import config from 'src/config';


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

/**
 * Takes a date string and returns the end of that day (11:59PM)
 *
 * If preventFuture is true and the given day IS the current day,
 * it returns the current time, i.e. the closest to the end
 * of the day without going into the future.
 *
 * @param {String} date - date string to base date on
 * @return {Date}
 */
export function getEndOfDay(date, { preventFuture } = {}) {
  const now = moment();
  const end = new Date(date);

  if (preventFuture && now.diff(end, 'days') === 0) {
    return now.toDate();
  }

  end.setHours(23, 59, 59, 999);
  return end;
}

export function getStartOfDay(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function isSameDate(a, b) {
  return (a instanceof Date) && (b instanceof Date) && (a.getTime() === b.getTime());
}

export function getRelativeDates(range) {
  const now = moment.utc();
  const to = now.toDate();

  switch (range) {
    case 'hour':
      return { to, from: moment(to).subtract(1, 'hour').toDate(), relativeRange: range };

    case 'day':
      return { to, from: moment(to).subtract(1, 'day').toDate(), relativeRange: range };

    case '7days':
      return { to, from: moment(to).subtract(7, 'day').toDate(), relativeRange: range };

    case '30days':
      return { to, from: moment(to).subtract(30, 'day').toDate(), relativeRange: range };

    case '90days':
      return { to, from: moment(to).subtract(90, 'day').toDate(), relativeRange: range };

    case 'custom':
      return { relativeRange: range };

    default:
      return {};
  }
}

export function formatDate(date) {
  return moment(date).format(config.dateFormat);
}

export function formatTime(time) {
  return moment(time).format(config.timeFormat);
}

export function formatDateTime(datetime) {
  return `${formatDate(datetime)}, ${formatTime(datetime)}`;
}
