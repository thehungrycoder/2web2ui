import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { required } from 'src/helpers/validation';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components';

import { Button } from '@sparkpost/matchbox';

export class LoginForm extends Component {

  renderLoginButtonText() {
    const { loginPending } = this.props;

    return loginPending
      ? <span>
        <i className="fa fa-spinner fa-spin" /> Logging In
      </span>
      : <span>Log In</span>;
  }

  render() {
    const { loginPending, pristine, ssoEnabled, handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Field
          autoFocus
          name='username'
          id='username'
          label='Email or Username'
          placeholder="Leslie Knope"
          component={TextFieldWrapper}
          validate={required}
        />

        { !ssoEnabled &&
        <Field
          type='password'
          name='password'
          id='password'
          label='Password'
          placeholder='Your Password'
          component={TextFieldWrapper}
        />
        }

        { !ssoEnabled &&
        <Field
          name='rememberMe'
          id='rememberMe'
          label='Keep me logged in'
          component={CheckboxWrapper}
        />
        }

        <Button submit disabled={loginPending || pristine}>
          {this.renderLoginButtonText()}
        </Button>
      </form>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    ssoEnabled: auth.ssoEnabled,
    loginPending: auth.loginPending,
    initialValues: {
      username: auth.username,
      password: auth.password,
      rememberMe: Boolean(auth.rememberMe)
    }
  };
}

const formOptions = {
  form: 'loginForm'
};

export default connect(mapStateToProps)(reduxForm(formOptions)(LoginForm));

