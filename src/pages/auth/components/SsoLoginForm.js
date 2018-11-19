import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { TextFieldWrapper } from 'src/components';
import { FORMS } from 'src/constants';
import { required } from 'src/helpers/validation';
import { trimWhitespaces } from 'src/helpers/string';
import { Button, Error } from '@sparkpost/matchbox';

export class SsoLoginForm extends React.Component {
  render() {
    const { loginPending, loginError, pristine, handleSubmit } = this.props;

    return (
      <React.Fragment>
        {loginError && <Error error={loginError} />}
        <form onSubmit={handleSubmit}>
          <Field
            autoFocus
            errorInLabel
            name="username"
            id="username"
            label="Email or Username"
            placeholder="email@example.com"
            normalize={trimWhitespaces}
            component={TextFieldWrapper}
            validate={required}
          />
          <Button primary submit disabled={loginPending || pristine}>
            {loginPending ? 'Logging In' : 'Log In'}
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  initialValues: {
    username: auth.username
  }
});

export default connect(mapStateToProps)(reduxForm({ form: FORMS.SSO })(SsoLoginForm));
