import React from 'react';
import DatePicker from 'src/components/datePicker/DatePicker';

const DatePickerWrapper = ({ input, ...rest }) => (
  // TODO - pass through validation error
  <DatePicker
    onChange={input.onChange}
    to={input.value.to}
    from={input.value.from}
    {...rest} />
);

export default DatePickerWrapper;
