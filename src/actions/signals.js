import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';

// order_by param values do not match field names, so we have to translate here
const ORDER_BY_MAPPING = {
  current_trap_hits: 'trap_hits',
  current_relative_trap_hits: 'perc'
};

export const getSpamHits = ({
  facet = '',
  filter,
  limit,
  relativeRange,
  offset,
  order,
  orderBy,
  subaccount
}) => {
  const { from , to } = getRelativeDates(relativeRange, { now: moment().subtract(1, 'day') });
  let order_by;

  if (orderBy) {
    order_by = ORDER_BY_MAPPING[orderBy] || orderBy;
  }

  return sparkpostApiRequest({
    type: 'GET_SPAM_HITS',
    meta: {
      method: 'GET',
      headers: setSubaccountHeader(subaccount),
      url: `/v1/signals/spam-hits/${facet}`,
      showErrorAlert: false,
      params: {
        filter,
        from: formatInputDate(from),
        limit,
        offset,
        order,
        order_by,
        to: formatInputDate(to)
      }
    }
  });
};

export const getEngagementRecency = ({
  facet = '',
  filter,
  relativeRange,
  subaccount
}) => {
  const { from , to } = getRelativeDates(relativeRange);

  return sparkpostApiRequest({
    type: 'GET_ENGAGEMENT_RECENCY',
    meta: {
      method: 'GET',
      headers: setSubaccountHeader(subaccount),
      url: `/v1/signals/cohort-engagement/${facet}`,
      showErrorAlert: false,
      params: {
        filter,
        to: formatInputDate(to),
        from: formatInputDate(from)
      }
    }
  });
};
