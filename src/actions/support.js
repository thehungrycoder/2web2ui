import sparkpostApiRequest from './helpers/sparkpostApiRequest';
import algolia from 'src/helpers/algolia';

export function createTicket({ subject, message }) {
  return sparkpostApiRequest({
    type: 'CREATE_TICKET',
    meta: {
      method: 'POST',
      url: '/integrations/support/ticket',
      data: {
        subject,
        message
      }
    }
  });
}

export function clearSupportForm() {
  return {
    type: 'RESET_SUPPORT_FORM'
  };
}

export function algoliaSearch(query) {
  return (dispatch) => {
    dispatch({ type: 'ALGOLIA_SEARCH_PENDING' });
    return algolia.search({
      query,
      attributesToRetrieve: ['permalink', 'post_title', 'post_excerpt'],
      attributesToHighlight: ['post_excerpt'],
      highlightPreTag: '<b>',
      highlightPostTag: '</b>'
    }).then(({ hits }) => {
      dispatch({
        type: 'ALGOLIA_SEARCH_SUCCESS',
        payload: hits
      });
    })
      .catch((err) => {
        dispatch({
          type: 'ALGOLIA_SEARCH_FAIL',
          payload: err
        });
      });
  };
}

