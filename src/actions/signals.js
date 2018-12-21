import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export const getSpamHits = ({
  facet = '',
  filter,
  relativeRange,
  subaccount
}) => {
  const { from , to } = getRelativeDates(relativeRange);

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
        // On appteam staging account this must be no later than Dec 18 2018
        to: formatInputDate(to)
      }
    }
  });
};
