import { createSelector } from 'reselect';
import _ from 'lodash';

/**
 * Selects all A/B test details, which are keyed by ID
 */
const selectDetails = (state) => state.abTesting.detailsById;

/**
 * Selects ID and version from router params
 */
export const selectIdAndVersionFromParams = (state, props) => ({
  id: _.get(props, 'match.params.id'),
  version: _.get(props, 'match.params.version')
});

/**
 * Selects a single test from router id and version params
 */
export const selectAbTestFromParams = createSelector(
  [selectDetails, selectIdAndVersionFromParams],
  (details, { id, version }) => _.get(details, `${id}.version_${version}`)
);

/**
 * Selects a test's latest version number from router id params
 */
export const selectLatestVersionNumberFromParams = createSelector(
  [selectDetails, selectIdAndVersionFromParams],
  (details, { id }) => _.get(details, `${id}.latest`)
);

/**
 * Sets up redux-form intialValues for draft and scheduled mode
 */
export const selectEditInitialValues = createSelector(
  [selectAbTestFromParams],
  (test) => {

    // Strip everything that is not editable
    const values = _.omit(test, ['created_at', 'updated_at', 'id', 'status', 'version']);

    return {
      // Set defaults values first
      test_mode: 'bayesian',
      metric: 'count_unique_clicked',
      confidence_level: 0.95,
      engagement_timeout: 24,
      audience_selection: 'percent',

      // Apply values to overwrite defaults
      ...values
    };
  }
);
