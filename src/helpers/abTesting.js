import _ from 'lodash';

export const formatFormValues = (values) => {
  let formattedValues = values;

  if (values.test_mode === 'learning') {
    formattedValues = _.omit(formattedValues, 'confidence_level');
  }

  if (values.audience_selection === 'percent') {
    formattedValues = _.omit(formattedValues, 'total_sample_size');
  }

  return formattedValues;
};
