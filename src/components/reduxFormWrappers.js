import React from 'react';
import { TextField, Select, Radio } from '@sparkpost/matchbox';

/*
 Wrapped matchbox components for use with react-redux Field components
*/

export const TextFieldWrapper = ({ input, meta: { touched, error }, ...rest }) => (
  <TextField id={input.name} {...rest} {...input} error={touched && error ? error : undefined} />
);

export const SelectWrapper = ({ input, meta: { error }, ...rest }) => (
  <Select id={input.name} {...input} error={error} {...rest}/>
);

export const RadioGroup = ({ input, options, title }) => (
  <Radio.Group>
    {title}
    {options.map((o) => (<Radio key={o.label} {...input} id={o.label} label={o.label} value={o.value} checked={o.value === input.value}/>))}
  </Radio.Group>
);
