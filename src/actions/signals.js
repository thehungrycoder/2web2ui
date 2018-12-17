import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export function getSpamTrapDetails({ facet = '', facetId = '', subaccount } = {}) {
  return (dispatch, getState) => {

    // const { relativeRange } = getState().signalOptions;
    // TODO generate from/to from relativeRange

    const headers = setSubaccountHeader(subaccount);

    return dispatch(sparkpostApiRequest({
      type: 'GET_SIGNALS_SPAM_TRAPS_DETAILS',
      meta: {
        method: 'GET',
        url: `/v1/signals/spam-hits/${facet}`,
        params: {
          filter: facetId,
          from: '2018-12-10',
          to: '2018-12-17'
        },
        headers
      }
    }));
  };
}
