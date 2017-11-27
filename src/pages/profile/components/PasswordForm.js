import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';

import { required, minLength } from 'src/helpers/validation';

import { TextFieldWrapper } from 'src/components';

export class PasswordForm extends Component {
  validatePasswords(value, allValues, props) {
    return value === props.currentPassword ? 'New Password is same as Current Password' : undefined;
  }

  render() {
    const { pristine, submitting, handleSubmit, currentPassword, newPassword } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          type="password"
          name='currentPassword'
          component={TextFieldWrapper}
          id='currentPassword'
          label='Current Password'
          validate={required}
        />

        <Field
          type="password"
          name='newPassword'
          id='newPassword'
          label='New Password'
          component={TextFieldWrapper}
          validate={[required, minLength(8), this.validatePasswords]}
        />

        <Button submit disabled={submitting || pristine || (currentPassword === newPassword)}>
          {submitting ? 'Updating Password' : 'Update Password'}
        </Button>
      </form>
    );
  }
}

const selector = formValueSelector('passwordForm');

const mapStateToProps = (state, props) => {
  const { form } = state;
  return {
    theForm: form.profileName, // breaks if you use a prop name 'form',
    currentPassword: selector(state, 'currentPassword'),
    newPassword: selector(state, 'newPassword')
  };
};

const formOptions = {
  form: 'passwordForm',
  enableReinitialize: true // required to update initial values from redux state
};

// breaks if you do reduxForm first
export default connect(mapStateToProps)(reduxForm(formOptions)(PasswordForm));
