import _ from 'lodash';

// Formats redux-form values before passing to API
export const formatFormValues = ({ default_template, variants, dates, ...values }) => {
  let formattedValues = values;

  if (values.test_mode === 'learning') {
    formattedValues = _.omit(formattedValues, 'confidence_level');
  }

  if (values.audience_selection === 'percent') {
    formattedValues = _.omit(formattedValues, 'total_sample_size');
  }

  formattedValues.default_template = formatTemplateObject(default_template);
  formattedValues.variants = variants.map(formatTemplateObject);

  formattedValues.start_time = dates.from;
  formattedValues.end_time = dates.to;

  return formattedValues;
};

const formatTemplateObject = ({ template_object, sample_size, percent }) => ({
  template_id: template_object.id,
  sample_size: sample_size,
  percent: percent
});
