export const filterNotificationsByTimeWindow = (now) => ({ meta }) => {
  const active = now.isSameOrAfter(meta.activeDate);
  const expired = (meta.expirationDate && now.isSameOrAfter(meta.expirationDate));

  return active && !expired;
};

export const sortNotificationsByActiveDate = (a, b) => new Date(b.meta.activeDate).getTime() - new Date(a.meta.activeDate).getTime();

export const applyUnreadStatus = (cutoff) => (notification) => {
  const { meta } = notification;
  const unread = cutoff.isBefore(meta.activeDate);
  return { ...notification, meta: { ...meta, unread }};
};
