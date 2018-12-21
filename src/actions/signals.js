import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import moment from 'moment';

export const getSpamHits = ({
  facet = '',
  filter,
  limit,
  relativeRange,
  offset,
  order,
  orderBy: order_by,
  subaccount
}) => {
  const { from , to } = getRelativeDates(relativeRange, { now: moment().subtract(1, 'day') });

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
