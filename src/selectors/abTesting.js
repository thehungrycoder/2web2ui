import { selectTemplates } from 'src/selectors/templates';
import { createSelector } from 'reselect';
import { findTemplateObject } from 'src/helpers/abTesting';
import _ from 'lodash';
import moment from 'moment';

/**
 * Selects all A/B test details, which are keyed by ID
 */
const selectDetails = (state) => state.abTesting.detailsById;

/**
 * Selects ID and version from router params
 */
export const selectIdAndVersionFromParams = (state, props) => ({
  id: _.get(props, 'match.params.id'),
  version: Number(_.get(props, 'match.params.version'))
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
  [selectAbTestFromParams, selectTemplates],
  (test, templates) => {

    // Strip everything that is not editable, or what will be reshaped
    const values = _.omit(test, ['created_at', 'updated_at', 'id', 'status', 'version', 'start_time', 'end_time', 'variants', 'default_template' ]);

    // Find template objects of the default template and all variants
    const default_template = findTemplateObject(templates, test.default_template);
    const variants = _.map(test.variants, (variant) => findTemplateObject(templates, variant));

    // Reshape dates and sets defaults
    const dates = {
      from: test.start_time ? new Date(test.start_time) : moment().add(1, 'd').toDate(),
      to: test.end_time ? new Date(test.end_time) : moment().add(8, 'd').toDate()
    };

    return {
      // Set defaults values first
      test_mode: 'bayesian',
      metric: 'count_unique_clicked',
      confidence_level: 0.95,
      engagement_timeout: 24,
      audience_selection: 'percent',

      // Apply values to overwrite defaults
      ...values,

      dates,
      default_template,

      // If no variants exist, produce at least one visible set of fields
      variants: variants.length ? variants : [{}]
    };
  }
);
