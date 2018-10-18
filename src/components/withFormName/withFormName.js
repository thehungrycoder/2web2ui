import React from 'react';
import { FormName } from 'redux-form';

// higher order component used to wrap containers
const withFormName = (WrappedComponent) => (props) => (
  <FormName>
    {({ form }) => <WrappedComponent {...props} formName={form} />}
  </FormName>
);

export default withFormName;
