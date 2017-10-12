import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { required, email } from 'src/helpers/validation';

import AccessSelect from './AccessSelect';

const formName = 'userForm';

const UserForm = (props) => {
  const { submitting, submitSucceeded, pristine, handleSubmit } = props;

  return <form onSubmit={handleSubmit}>
    <p>An invitation will be sent to the email address you supply</p>
    <Field
      name="email"
      validate={[required, email]}
      label="Email address"
      component={TextFieldWrapper}
    />
    <Field name="access" label="Role" component={AccessSelect} />
    <Button submit primary disabled={submitting || pristine}>
      Add user
    </Button>
    {submitting && !submitSucceeded && <div>Loading&hellip;</div>}
  </form>;
};

const UserReduxForm = reduxForm({ form: formName })(UserForm);
export default connect(() => ({
  initialValues: {
    access: 'admin' // Sadly redux-form does not reflect a select's initial value
  }
}), { formChange: change })(UserReduxForm);
