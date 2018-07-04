import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import Recaptcha from 'react-recaptcha';

import config from 'src/config';
import { LINKS } from 'src/constants';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { Button, UnstyledLink, Grid, Checkbox } from '@sparkpost/matchbox';
import { required, minLength, email, endsWithWhitespace } from 'src/helpers/validation';
import styles from './JoinForm.module.scss';
const { recaptcha } = config;

/** Recaptcha flow
 *
 * UX:
 * Disable form until recaptcha is ready
 * Challenge with recaptcha when Create Account button is clicked
 * Submits form data to api upon successful completetion of recaptcha challenge


 * Code
 * Recaptcha script is loaded in JoinPage
 * When script is loaded, Recaptcha component will initialize it and bind to different callbacks
 * ref: reference to recaptcha instance
 * onloadCallback: it's triggered upon Recaptcha's dependencies (global) is completely loaded. we enable form at that point
 * executeRecaptcha: this is triggered, when user clicks Create Account button. captcha challenge is presented to user and submitted to Google for validation
 * verifyCallback: this is triggered upon user completes recaptcha challenge successfuly. we pass the data we've received
 */


export class JoinForm extends Component {
  state = {
    reCaptchaReady: false,
    reCaptchaInstance: null,
    recaptcha_response: null
  };

  reCaptchaLoaded = () => {
    this.setState({ reCaptchaReady: true });
  };

  onSubmit = (formValues) => this.props.onSubmit({ ...formValues, recaptcha_response: this.state.recaptcha_response, recaptcha_type: 'invisible' })

  recaptchaVerifyCallback = (response) => {
    this.state.reCaptchaInstance.reset();
    this.setState({ recaptcha_response: response }, this.props.handleSubmit(this.onSubmit));
  };

  executeRecaptcha = () => this.state.reCaptchaInstance.execute();

  linkRecaptcha = (instance) => {
    if (!this.state.reCaptchaInstance) {
      this.setState({ reCaptchaInstance: instance });
    }
  };

  render() {
    const {
      loading,
      pristine,
      invalid,
      submitting
    } = this.props;

    const { reCaptchaReady } = this.state;

    const pending = loading || submitting || !reCaptchaReady;

    return (
      <form>
        <Grid className={styles.spacer}>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='first_name'
              component={TextFieldWrapper}
              label='First Name'
              autoComplete='given-name'
              validate={required}
              disabled={pending}
              placeholder='Leslie'
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='last_name'
              component={TextFieldWrapper}
              label='Last Name'
              autoComplete='family-name'
              validate={required}
              disabled={pending}
              placeholder='Knope'
            />
          </Grid.Column>
        </Grid>
        <Field
          name='email'
          component={TextFieldWrapper}
          label='Email'
          validate={[required, email]}
          disabled={pending}
          autoComplete='username email'
          placeholder='leslie.knope@pawnee.indiana.state.us.gov'
        />
        <Field
          name='password'
          component={TextFieldWrapper}
          label='Password'
          validate={[required, minLength(8), endsWithWhitespace]}
          disabled={!reCaptchaReady || loading}
          type='password'
          autoComplete='new-password'
          placeholder='••••••••••'
        />

        <Checkbox.Group>
          <Field
            name='email_opt_in'
            id='email_opt_in'
            component={CheckboxWrapper}
            disabled={pending}
            type='checkbox'
            label={<span>I'm happy to receive marketing email from SparkPost</span>}
          />

          <Field
            name="tou_accepted"
            id='tou_accepted'
            component={CheckboxWrapper}
            type="checkbox"
            disabled={pending}
            validate={required}
            label={<span>I agree to SparkPost's <UnstyledLink to={LINKS.TOU} external>Terms of Use</UnstyledLink></span>}
          />
        </Checkbox.Group>

        <Button primary
          disabled={pending || pristine || invalid}
          onClick={this.executeRecaptcha}
        >
          {loading ? 'Loading' : 'Create Account'}
        </Button>

        <Recaptcha
          ref={this.linkRecaptcha}
          sitekey={recaptcha.invisibleKey}
          size="invisible"
          render='explicit'
          onloadCallback={this.reCaptchaLoaded}
          verifyCallback={this.recaptchaVerifyCallback}
        />

      </form>
    );
  }
}
const formName = 'registerAccountForm';
const mapStateToProps = (state, props) => ({
  initialValues: {
    tou_accepted: false,
    email_opt_in: false
  },
  loading: state.account.createLoading || state.auth.loginPending,
  formValues: getFormValues(formName)(state)
});

const RegisterAccountForm = reduxForm({ form: formName })(JoinForm);
export default connect(mapStateToProps, {})(RegisterAccountForm);
