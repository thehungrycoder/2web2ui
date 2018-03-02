import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'src/actions/password';
import { showAlert } from 'src/actions/globalAlert';
import { required } from 'src/helpers/validation';
import { reduxForm, Field } from 'redux-form';
import { CenteredLogo, TextFieldWrapper } from 'src/components';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';

const successAlert = {
  type: 'success',
  message: 'If you have an account with us, please check your email for your password reset instructions.'
};

const errorAlert = {
  type: 'error',
  message: 'Unable to send your password reset email.'
};

export class ForgotPasswordPage extends Component {
  componentDidUpdate(prevProps) {
    const { emailSuccess, emailError, history, showAlert } = this.props;

    if (!prevProps.emailSuccess && emailSuccess) {
      history.push('/auth');
      showAlert(successAlert);
    }

    if (!prevProps.emailError && emailError) {
      showAlert({ ...errorAlert, details: emailError.message });
    }
  }

  render() {
    const { handleSubmit, invalid, submitting, sendPasswordResetEmail } = this.props;

    const buttonText = submitting
      ? 'Sending Email..'
      : 'Reset Password';

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent sectioned title='Reset Your Password'>
          <form onSubmit={handleSubmit(sendPasswordResetEmail)}>
            <p>Provide your username or email and we'll send an email to reset your password.</p>
            <Field
              name='user'
              label='Username or email address'
              validate={required}
              component={TextFieldWrapper}
            />
            <Button primary submit disabled={invalid || submitting}>{buttonText}</Button>
          </form>
        </Panel>
        <Panel.Footer
          left={<small>Remember your password? <UnstyledLink to='/auth' Component={Link}>Log in</UnstyledLink>.</small>}
        />
      </Fragment>
    );
  }
}

const formOptions = { form: 'forgotPassword' };
const mapStateToProps = ({ password }) => (password);
export default connect(mapStateToProps, { sendPasswordResetEmail, showAlert })(reduxForm(formOptions)(ForgotPasswordPage));
