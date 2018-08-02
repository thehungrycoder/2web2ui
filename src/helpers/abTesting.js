import _ from 'lodash';

// Formats redux-form values before passing to API
export const formatFormValues = (values) => {
  let formattedValues = values;

  if (values.test_mode === 'learning') {
    formattedValues = _.omit(formattedValues, 'confidence_level');
  }

  if (values.audience_selection === 'percent') {
    formattedValues = _.omit(formattedValues, 'total_sample_size');
  }

  formattedValues.default_template = formatTemplateObject(values.default_template);
  formattedValues.variants = values.variants.map(formatTemplateObject);

  return formattedValues;
};

const formatTemplateObject = ({ template_object, sample_size, percent }) => ({
  template_id: template_object.id,
  sample_size: sample_size,
  percent: percent
});
