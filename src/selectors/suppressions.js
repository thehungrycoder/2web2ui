import convertListToBoolHash from 'src/helpers/convertListToBoolHash';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import _ from 'lodash';

// create a "selector creator" that uses lodash.isEqual instead of ===
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, _.isEqual);

const selectSuppressionsSearch = (state) => state.suppressions.search;

const selectSortedTypes = createSelector(
  [selectSuppressionsSearch],
  ({ types = []}) => [ ...types ].sort()
);

const selectSortedSources = createSelector(
  [selectSuppressionsSearch],
  ({ sources = []}) => [ ...sources ].sort()
);

export const selectSearchInitialValues = createDeepEqualSelector(
  [selectSortedTypes, selectSortedSources],
  (types, sources) => ({
    types: convertListToBoolHash(types),
    sources: convertListToBoolHash(sources)
  })
);
