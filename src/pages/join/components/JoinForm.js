/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import Recaptcha from 'react-recaptcha';

import config from 'src/config';
import { LINKS } from 'src/constants';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { Button, UnstyledLink, Grid, Label } from '@sparkpost/matchbox';
import { required, minLength, email } from 'src/helpers/validation';
import styles from '../JoinPage.module.scss';
const { recaptcha } = config;

export class JoinForm extends Component {
  state = {
    reCaptchaReady: false,
    reCaptchaInstance: null
  }

  reCaptchaLoaded = () => {
    this.setState({ reCaptchaReady: true });
  }

  recaptchaVerifyCallback = (response) => {
    const { formValues, onSubmit } = this.props;
    this.reCaptchaInstance.reset();
    onSubmit({ ...formValues, recaptcha_response: response, recaptcha_type: 'invisible' });
  }

  executeRecaptcha = () => {
    this.reCaptchaInstance.execute();
  }

  render() {
    const {
      loading,
      pristine,
      invalid
    } = this.props;

    const { reCaptchaReady } = this.state;

    return (
      <form>
        <Grid className={styles.spacer}>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='first_name'
              component={TextFieldWrapper}
              label='First Name'
              validate={required}
              disabled={!reCaptchaReady || loading}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='last_name'
              component={TextFieldWrapper}
              label='Last Name'
              validate={required}
              disabled={!reCaptchaReady || loading}
            />
          </Grid.Column>
        </Grid>
        <Field
          name='email'
          component={TextFieldWrapper}
          label='Email'
          validate={[required, email]}
          disabled={!reCaptchaReady || loading}
          autoComplete='username email'
        />
        <Field
          name='password'
          component={TextFieldWrapper}
          label='Password'
          validate={[required, minLength(8)]}
          disabled={!reCaptchaReady || loading}
          type='password'
          autoComplete='new-password'
        />
        <div className={styles.inline}>
          <Field
            name="tou_accepted"
            id='tou_accepted'
            component={CheckboxWrapper}
            type="checkbox"
            disabled={!reCaptchaReady || loading}
            validate={required}
          />
          <div className={styles.touLabel}>
            <Label id='tou_accepted'>
              I agree to SparkPost's <UnstyledLink to={LINKS.TOU} external>Terms of Use</UnstyledLink>
            </Label>
          </div>
        </div>

        <Button primary 
        disabled={loading || pristine || invalid || !reCaptchaReady }
        onClick={this.executeRecaptcha}
        >
          { loading ? 'Loading' : 'Create Account' }
        </Button>

        <Recaptcha
          ref={(e) => this.reCaptchaInstance = e}
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
    tou_accepted: false
  },
  loading: state.account.createLoading,
  formValues: getFormValues(formName)(state)
});

const RegisterAccountForm = reduxForm({ form: formName })(JoinForm);
export default connect(mapStateToProps, {})(RegisterAccountForm);
