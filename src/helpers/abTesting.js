import _ from 'lodash';

/**
 * Formats edit mode's redux-form values to be passed on to the API
 */
export const formatFormValues = ({ default_template, variants, dates, ...rest }) => {
  let values = _.clone(rest);

  if (values.test_mode === 'learning') {
    values = _.omit(values, 'confidence_level');
  } else {
    values.confidence_level = parseFloat(values.confidence_level);
  }

  if (values.audience_selection === 'percent') {
    values = _.omit(values, 'total_sample_size');
    delete default_template.sample_size;
    variants = _.map(variants, (variant) => _.omit(variant, 'sample_size'));
  } else {
    values.total_sample_size = calculateTotalSampleSize({ default_template, variants });
    delete default_template.percent;
    variants = _.map(variants, (variant) => _.omit(variant, 'percent'));
  }

  // Cast stringified values to numbers
  default_template[values.audience_selection] = parseFloat(default_template[values.audience_selection]);
  _.forEach(variants, (variant) => variant[values.audience_selection] = parseFloat(variant[values.audience_selection]));
  values.engagement_timeout = parseInt(values.engagement_timeout, 10);

  return {
    ...values,
    start_time: dates.from,
    end_time: dates.to,
    default_template: reduceTemplateObject(default_template),
    variants: variants.map(reduceTemplateObject)
  };
};

/**
 * Formats template object (default template and variants) from redux-form to be passed on to the API
 * The template typeahead returns the full template object, we only need its ID
 */
export const reduceTemplateObject = ({ template_object, ...rest } = {}) => ({
  template_id: _.get(template_object, 'id'),
  ...rest
});

/**
 * Formats template object (default template and variants) from the API to be passed on to redux-form
 * The template typeahead expects full template objects
 */
export const findTemplateObject = (templates, { template_id, ...rest } = {}) => ({
  template_object: _.find(templates, ({ id }) => id === template_id),
  ...rest
});

/**
 * Calculates the total_sample_size of a test based upon the sample_size of default_template & variants
 */
export const calculateTotalSampleSize = ({ default_template, variants }) =>
  _.reduce(
    variants,
    (sum, variant) => sum + parseInt(variant.sample_size, 10),
    parseInt(default_template.sample_size, 10)
  );

export const formatDraftOptionalValues = (values) => {
  _.remove(values.variants, (variant) => 'percent' in variant && !_.isFinite(variant.percent));
  _.remove(values.variants, (variant) => 'sample_size' in variant && !_.isFinite(variant.sample_size));

  if (values.variants.length === 0) {
    delete values.variants;
  }

  if ('percent' in values.default_template && !_.isFinite(values.default_template.percent)) {
    values.default_template.percent = 100;
  }

  if ('sample_size' in values.default_template && !_.isFinite(values.default_template.sample_size)) {
    values.default_template.sample_size = 1;
  }

  if ('total_sample_size' in values && (values.total_sample_size === 0 || isNaN(values.total_sample_size))) {
    values.total_sample_size = 1;
  }

  return values;
};
