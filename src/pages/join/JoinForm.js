import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import { LINKS } from 'src/constants';
import { TextFieldWrapper, CheckboxWrapper } from 'src/components/reduxFormWrappers';
import { Button, UnstyledLink, Grid, Label } from '@sparkpost/matchbox';
import { required, minLength, email } from 'src/helpers/validation';
import styles from './JoinPage.module.scss';

export class JoinForm extends Component {

  render() {
    const {
      handleSubmit,
      submitting,
      pristine,
      invalid
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Grid className={styles.spacer}>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='first_name'
              component={TextFieldWrapper}
              label='First Name'
              validate={required}
              disabled={false}
            />
          </Grid.Column>
          <Grid.Column xs={12} md={6} lg={6}>
            <Field
              name='last_name'
              component={TextFieldWrapper}
              label='Last Name'
              validate={required}
              disabled={false}
            />
          </Grid.Column>
        </Grid>
        <Field
          name='email'
          component={TextFieldWrapper}
          label='Email'
          validate={[required, email]}
          disabled={false}
        />
        <Field
          name='password'
          component={TextFieldWrapper}
          label='Password'
          validate={[required, minLength(8)]}
          disabled={false}
          type='password'
          autoComplete='new-password'
          // data-lpignore={true} // removes inaccurate LastPass password management behavior
        />
        <div className={styles.inline}>
          <Field
            name='tou_accepted'
            id='tou_accepted'
            label=''
            validate={required}
            component={CheckboxWrapper}
          />
          <div className={styles.touLabel}>
            <Label id='tou_accepted'>
              I agree to SparkPost's <UnstyledLink to={LINKS.TOU} external>Terms of Use</UnstyledLink>
            </Label>
          </div>
        </div>

        <Button primary submit disabled={submitting || pristine || invalid }>{ submitting ? 'Loading' : 'Create Account' }</Button>
      </form>
    );
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: { }
});

const RegisterUserReduxForm = reduxForm({ form: 'RegisterUser' })(JoinForm);
export default connect(mapStateToProps, {})(RegisterUserReduxForm);
