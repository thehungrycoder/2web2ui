import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextFieldWrapper, CheckboxWrapper, PageLink } from 'src/components';
import { FORMS } from 'src/constants';
import { required } from 'src/helpers/validation';
import { trimWhitespaces } from 'src/helpers/string';
import { Button } from '@sparkpost/matchbox';

export class LoginForm extends Component {
  render() {
    const { loginPending, ssoEnabled, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          autoFocus
          errorInLabel
          name='username'
          id='username'
          label='Email or Username'
          placeholder='email@example.com'
          normalize={trimWhitespaces}
          component={TextFieldWrapper}
          validate={required}
        />

        {!ssoEnabled &&
        <Field
          type='password'
          name='password'
          id='password'
          label='Password'
          placeholder='••••••••'
          component={TextFieldWrapper}
          helpText={<PageLink to='/forgot-password'>Forgot your password?</PageLink>}
        />
        }

        {!ssoEnabled &&
        <Field
          name='rememberMe'
          id='rememberMe'
          label='Keep me logged in'
          component={CheckboxWrapper}
        />
        }

        <Button primary submit disabled={loginPending}>
          {loginPending ? 'Logging In' : 'Log In'}
        </Button>
      </form>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    loginPending: auth.loginPending,
    initialValues: {
      username: auth.username,
      password: auth.password,
      rememberMe: Boolean(auth.rememberMe)
    }
  };
}

export default connect(mapStateToProps)(reduxForm({ form: FORMS.LOGIN })(LoginForm));
