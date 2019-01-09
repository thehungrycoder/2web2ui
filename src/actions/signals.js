import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import moment from 'moment';

// order_by param values do not match field names, so we have to translate here
const ORDER_BY_MAPPING = {
  current_engaged_recipients: 'c_14d',
  current_relative_engaged_recipients: 'perc',
  current_relative_trap_hits: 'perc',
  current_trap_hits: 'trap_hits'
};

const signalsActionCreator = ({ dimension, type }) => ({
  facet = '',
  filter,
  limit,
  offset,
  order,
  orderBy,
  relativeRange,
  subaccount
}) => {
  const { from , to } = getRelativeDates(relativeRange, { now: moment().subtract(1, 'day') });
  let order_by;

  if (orderBy) {
    order_by = ORDER_BY_MAPPING[orderBy] || orderBy;
  }

  if (facet === 'sid') {
    facet = '';
    subaccount = filter;
    filter = '';
  }

  return sparkpostApiRequest({
    type,
    meta: {
      method: 'GET',
      headers: setSubaccountHeader(subaccount),
      url: `/v1/signals/${dimension}/${facet}`,
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

export const getSpamHits = signalsActionCreator({
  dimension: 'spam-hits',
  type: 'GET_SPAM_HITS'
});

export const getEngagementRecency = signalsActionCreator({
  dimension: 'cohort-engagement',
  type: 'GET_ENGAGEMENT_RECENCY'
});

export const getHealthScore = signalsActionCreator({
  dimension: 'health-score',
  type: 'GET_HEALTH_SCORE'
});
