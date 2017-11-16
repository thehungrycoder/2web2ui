import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { required } from 'src/helpers/validation';

import { TextFieldWrapper } from 'src/components';

export class NameForm extends Component {
  render() {
    const { pristine, submitting, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          // for redux-form
          name='firstName'
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
