import _ from 'lodash';

/**
 * Formats edit mode's redux-form values to be passed on to the API
 */
export const formatFormValues = ({ default_template, variants, dates, ...rest }) => {
  let values = rest;

  if (values.test_mode === 'learning') {
    values = _.omit(values, 'confidence_level');
  }

  if (values.audience_selection === 'percent') {
    values = _.omit(values, 'total_sample_size');
  }

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
const reduceTemplateObject = ({ template_object, ...rest } = {}) => ({
  template_id: template_object.id,
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
