import { formatInputDate, getRelativeDates } from 'src/helpers/date';
import setSubaccountHeader from './helpers/setSubaccountHeader';
import sparkpostApiRequest from './helpers/sparkpostApiRequest';

export const getSpamHits = ({ filter, type = 'GET_SIGNALS_SPAM_HITS' } = {}) => (
  (dispatch, getState) => {
    const { signalOptions: { facet = '', facetSearchTerm, relativeRange, subaccount }} = getState();
    const { from , to } = getRelativeDates(relativeRange);

    return dispatch(
      sparkpostApiRequest({
        type,
        meta: {
          method: 'GET',
          headers: setSubaccountHeader(subaccount),
          url: `/v1/signals/spam-hits/${facet}`,
          showErrorAlert: false,
          params: {
            filter: filter || facetSearchTerm,
            from: formatInputDate(from),
            to: formatInputDate(to)
          }
        }
      })
    );
  }
);

export const getSpamHitsDetails = ({ facetId, ...rest }) => (
  getSpamHits({
    ...rest,
    type: 'GET_SIGNALS_SPAM_HITS_DETAILS',
    filter: facetId
  })
);
