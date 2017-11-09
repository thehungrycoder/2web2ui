import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextField, Button } from '@sparkpost/matchbox';
import { required } from 'src/helpers/validation';

// This is wierd
// Needed to pull out meta
// Probably need to do a transform on `error`?
const TextFieldWrapper = ({ input, meta: { error }, ...rest }) => (
  <TextField {...rest} {...input} error={error} />
);

export class NameForm extends Component {
  render() {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          // for redux-form
          name='first_name'
          component={TextFieldWrapper}

          // for the matchbox component
          id='firstName'
          label='First Name'
          validate={required}
        />

        <Field
          name='lastName'
          id='lastName'
          label='Last Name'
          component={TextFieldWrapper}
          validate={required}
        />

        <Button submit disabled={submitting || pristine}>
          {submitting ? 'Updating Profile' : 'Update Profile'}
        </Button>
      </form>
    );
  }
}

const mapStateToProps = ({ form, currentUser }) => ({
  theForm: form.profileName, // breaks if you use a prop name 'form'
  initialValues: {
    first_name: currentUser.first_name,
    last_name: currentUser.last_name
  }
});

const formOptions = {
  form: 'profileName',
  enableReinitialize: true // required to update initial values from redux state
};

// breaks if you do reduxForm first
export default connect(mapStateToProps)(reduxForm(formOptions)(NameForm));
