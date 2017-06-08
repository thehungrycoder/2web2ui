import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button } from '@sparkpost/matchbox';

// This is wierd
// Needed to pull out meta
// Probably need to do a transform on `error`?
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

export class NameForm extends Component {
  render () {
    return (
      <form>
        <Field
          // for redux-form
          name='firstName'
          component={TextFieldWrapper}

          // for the matchbox component
          id='firstName'
          label='First Name'
        />

        <Field
          name='lastName'
          id='lirstName'
          label='Last Name'
          component={TextFieldWrapper}
        />

        <Button submit>Update Profile</Button>
      </form>
    );
  }
}

const mapStateToProps = ({ form, currentUser }) => ({
  theForm: form.profileName, // breaks if you use a prop name 'form'
  initialValues: {
    firstName: currentUser.first_name,
    lastName: currentUser.last_name
  }
});

const formOptions = {
  form: 'profileName',
  enableReinitialize: true // required to update initial values from redux state
};

// breaks if you do reduxForm first
export default connect(mapStateToProps)(reduxForm(formOptions)(NameForm));
