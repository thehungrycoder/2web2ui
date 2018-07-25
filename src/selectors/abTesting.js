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

export const selectEditInitialValues = createSelector(
  [selectAbTest],
  (test) => {

    // Strip everything that is not editable
    const values = _.omit(test, ['created_at', 'updated_at', 'id', 'status', 'veresion']);
    
    return {
      // Set defaults values first
      test_mode: 'bayesian',
      metric: 'count_unique_clicked',
      confidence_level: 0.95,
      engagement_timeout: 24,

      // Apply values to overwrite defaults
      ...values
    }
  }
)
