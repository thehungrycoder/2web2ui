import { createSelector } from 'reselect';
import _ from 'lodash';

const selectDetails = (state) => state.abTesting.detailsById;

export const selectIdAndVersion = (state, props) => ({
  id: _.get(props, 'match.params.id'),
  version: _.get(props, 'match.params.version')
});

export const selectAbTest = createSelector(
  [selectDetails, selectIdAndVersion],
  (details, { id, version }) => _.get(details, `${id}.version_${version}`)
);
