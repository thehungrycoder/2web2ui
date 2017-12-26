import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import config from 'src/config';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { Button, UnstyledLink } from '@sparkpost/matchbox';
import { required, hasLetter, hasNumber, specialCharacter, endsWithWhitespace, minLength } from 'src/helpers/validation';

export class RegisterUserForm extends Component {

  render() {
    const {
      handleSubmit,
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          name='username'
          component={TextFieldWrapper}
          label='Username'
          validate={required}
          disabled={true}
        />
        <Field
          name='password'
          component={TextFieldWrapper}
          label='Password'
          helpText='Your password must have at least 8 characters and include 1 letter, 1 number, and 1 non-alphanumeric character.'
          validate={[required, minLength(8)]}
          warn={[hasLetter, hasNumber, specialCharacter, endsWithWhitespace]}
          disabled={submitting}
          type='password'
          autoComplete='new-password'
        />
        <p><small>By joining, you agree to SparkPost's <UnstyledLink target='_blank' to={config.touLink}>Terms of Use</UnstyledLink></small></p>
        <Button primary submit disabled={submitting}>{ submitting ? 'Loading' : 'Confirm' }</Button>
      </form>
    );
  }
}

const mapStateToProps = (state, { email }) => ({
  initialValues: { username: email }
});

const RegisterUserReduxForm = reduxForm({ form: 'RegisterUser' })(RegisterUserForm);
export default connect(mapStateToProps, {})(RegisterUserReduxForm);
