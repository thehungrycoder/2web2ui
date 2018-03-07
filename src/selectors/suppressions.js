import convertListToBoolHash from 'src/helpers/convertListToBoolHash';
import { createSelector } from 'reselect';

const selectSuppressionsSearch = (state) => state.suppressions.search;

const selectTypes = createSelector(
  [selectSuppressionsSearch],
  ({ types = []}) => types
);

const selectSources = createSelector(
  [selectSuppressionsSearch],
  ({ sources = []}) => sources
);

export const selectSearchInitialValues = createSelector(
  [selectTypes, selectSources],
  (types, sources) => ({
    types: convertListToBoolHash(types),
    sources: convertListToBoolHash(sources)
  })
);


