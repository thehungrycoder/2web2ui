/**
 * Takes a string date and returns a moment comparison precision
 * value if the date is only YMD, otherwise undefined
 *
 * @param {String} date
 */
export const getPrecision = (date) => {
  if (date && date.length === 10) {
    return 'day';
  }
};

export const filterNotificationsByTimeWindow = (now) => ({ meta }) => {
  const active = now.isSameOrAfter(meta.activeDate, getPrecision(meta.activeDate));
  const expired = (meta.expirationDate && now.isSameOrAfter(meta.expirationDate, getPrecision(meta.expirationDate)));

  return active && !expired;
};

export const sortNotificationsByActiveDate = (a, b) => new Date(b.meta.activeDate).getTime() - new Date(a.meta.activeDate).getTime();

export const applyUnreadStatus = (cutoff) => (notification) => {
  const { meta } = notification;
  const unread = cutoff.isBefore(meta.activeDate, getPrecision(meta.activeDate));
  return { ...notification, meta: { ...meta, unread }};
};
