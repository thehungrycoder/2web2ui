import React from 'react';
import DatePicker from 'src/components/datePicker/DatePicker';

const DatePickerWrapper = ({ input, meta, ...rest }) => {
  const { active, error, touched } = meta;
  return (
    <DatePicker
      {...input}
      to={input.value.to}
      from={input.value.from}
      error={!active && touched && error ? error : undefined}
      {...rest} />
  );
};

export default DatePickerWrapper;
