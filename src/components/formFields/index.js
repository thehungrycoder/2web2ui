import React from 'react';
import { Field } from 'redux-form';
import {
  TextFieldWrapper,
  SelectWrapper
} from 'src/components/reduxFormWrappers';

export const TextField = (props) => <Field component={TextFieldWrapper} {...props} />;
export const SelectField = (props) => <Field component={SelectWrapper} {...props} />;
