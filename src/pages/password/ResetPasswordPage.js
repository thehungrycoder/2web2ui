import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { resetPassword } from 'src/actions/password';
import { showAlert } from 'src/actions/globalAlert';
import { required, minLength, endsWithWhitespace } from 'src/helpers/validation';
import { reduxForm, Field } from 'redux-form';
import { CenteredLogo, TextFieldWrapper } from 'src/components';
import { Panel, Button, UnstyledLink } from '@sparkpost/matchbox';
import _ from 'lodash';

export class ResetPasswordPage extends Component {
  handleResetPassword = ({ newPassword: password }) => {
    const { resetPassword, token } = this.props;
    return resetPassword({ password, token });
  }

  componentDidUpdate(prevProps) {
    const { resetSuccess, resetError, history, showAlert } = this.props;

    if (!prevProps.resetSuccess && resetSuccess) {
      showAlert({ type: 'success', message: 'Your password has been updated.' });
      history.push('/auth');
    }

    if (!prevProps.resetError && resetError) {
      if (_.get(resetError, 'response.status') === 401) {
        showAlert({
          type: 'error',
          message: 'Your password reset request has expired. Please resubmit your request.'
        });
        history.push('/forgot-password');
      } else {
        showAlert({
          type: 'error',
          message: 'Unable to update your password.',
          details: resetError.message
        });
      }
    }
  }

  confirmPassword = (value, { newPassword, confirmNewPassword }) => newPassword === confirmNewPassword ? undefined : 'Must be the same password'

  render() {
    const { handleSubmit, invalid, submitting } = this.props;

    const buttonText = submitting
      ? 'Creating Password..'
      : 'Create New Password';

    return (
      <Fragment>
        <CenteredLogo />
        <Panel accent sectioned title='Create a New Password'>
          <form onSubmit={handleSubmit(this.handleResetPassword)}>
            <Field
              name='newPassword'
              type='password'
              autoComplete='new-password'
              label='New Password'
              validate={[required, minLength(8), endsWithWhitespace]}
              component={TextFieldWrapper}
            />
            <Field
              name='confirmNewPassword'
              type='password'
              label='Confirm New Password'
              validate={[required, minLength(8), endsWithWhitespace, this.confirmPassword]}
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

const formOptions = { form: 'resetPassword' };
const mapStateToProps = ({ password }, props) => ({
  ...password,
  token: props.match.params.token
});
export default connect(mapStateToProps, { resetPassword, showAlert })(reduxForm(formOptions)(ResetPasswordPage));
