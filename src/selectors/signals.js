import { createSelector } from 'reselect';
import _ from 'lodash';

// Router props
export const getFacetFromParams = (state, props) => _.get(props, 'match.params.facet');
export const getFacetIdFromParams = (state, props) => _.get(props, 'match.params.facetId');
export const getSelectedDateFromRouter = (state, props) => _.get(props, 'location.state.date');

// Redux store
export const getSpamHitsData = (state, props) => _.get(state, 'signals.spamHits', {});

export const selectSpamHitsDetails = createSelector(
  [getSpamHitsData, getFacetFromParams, getFacetIdFromParams],
  ({ loading, error, data }, facet, facetId) => {
    const match = _.find(data, [facet, facetId]) || {};
    const history = match.history || [];

    return {
      details: {
        data: history,
        empty: !history.length && !loading,
        error,
        loading
      },
      facet,
      facetId
    };
  }
);
