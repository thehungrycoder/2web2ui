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
import styles from './JoinPage.module.scss';
const { recaptcha } = config;

const formName = 'registerAccountForm';

let reCaptchaInstance;
export class JoinForm extends Component {
  state = {
    reCaptchaReady: false
  }

  executeRecaptcha = (values) => {
    reCaptchaInstance.execute();
  }

  reCaptchaLoaded = () => {
    this.setState({ reCaptchaReady: true });
  }

  verifyCallback = (response) => {
    const { formValues, onSubmit } = this.props;
    reCaptchaInstance.reset();
    onSubmit({ ...formValues, recaptcha_response: response, recaptcha_type: 'invisible' });
  }

  render() {
    const {
      submitting,
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
              disabled={!reCaptchaReady || submitting}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='last_name'
              component={TextFieldWrapper}
              label='Last Name'
              validate={required}
              disabled={!reCaptchaReady || submitting}
            />
          </Grid.Column>
        </Grid>
        <Field
          name='email'
          component={TextFieldWrapper}
          label='Email'
          validate={[required, email]}
          disabled={!reCaptchaReady || submitting}
          autoComplete='username email'
        />
        <Field
          name='password'
          component={TextFieldWrapper}
          label='Password'
          validate={[required, minLength(8)]}
          disabled={!reCaptchaReady || submitting}
          type='password'
          autoComplete='new-password'
        />
        <div className={styles.inline}>
          <Field
            name="tou_accepted"
            id='tou_accepted'
            component={CheckboxWrapper}
            type="checkbox"
            disabled={!reCaptchaReady || submitting}
          />
          <div className={styles.touLabel}>
            <Label id='tou_accepted'>
              I agree to SparkPost's <UnstyledLink to={LINKS.TOU} external>Terms of Use</UnstyledLink>
            </Label>
          </div>
        </div>

        <Button primary
          disabled={submitting || pristine || invalid || !reCaptchaReady }
          onClick={this.executeRecaptcha}
          id='g-recaptcha'
        >
          { submitting ? 'Loading' : 'Create Account' }
        </Button>

        <Recaptcha
          ref={(e) => reCaptchaInstance = e}
          sitekey={recaptcha.invisibleKey}
          size="invisible"
          render='explicit'
          onloadCallback={this.reCaptchaLoaded}
          verifyCallback={this.verifyCallback}
        />

      </form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: {
    tou_accepted: false
  },
  formValues: getFormValues(formName)(state)
});

const RegisterAccountForm = reduxForm({ form: formName })(JoinForm);
export default connect(mapStateToProps, {})(RegisterAccountForm);
