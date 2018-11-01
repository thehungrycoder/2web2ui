import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { TextFieldWrapper, ApiErrorBanner } from 'src/components';
import styles from './RecipientVerificationPage.module.scss';
import { required, maxLength } from 'src/helpers/validation';
import { singleAddress } from 'src/actions/recipientVerificationLists';
import SingleResult from './SingleResult';

const formName = 'singleAddressForm';
let preSubmit;
export class SingleAddressForm extends Component {

  singleAddressForm = (values) => this.props.singleAddress(values.address);

  pageLoad = () => {
    preSubmit = true;
  };

  componentDidMount() {
    this.pageLoad();
  }

  renderError() {
    return (
      <ApiErrorBanner
        errorDetails={this.props.errors.payload.message}
        message="Sorry, we ran into an error verifying your email address."
        reload={this.pageLoad}
      />
    );
  }

  render() {
    const { errors, pristine, email, results, valid, reason, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    if (submitting) {
      preSubmit = false;
    }

    return (
      <Fragment>
        {errors && !preSubmit && this.renderError()}
        <form onSubmit={handleSubmit(this.singleAddressForm)}>
          <p className={styles.Paragraph}>Verify an email address to determine if it is a deliverable email address or a rejected, undeliverable email address.</p>
          <Field
            name='address'
            component={TextFieldWrapper}
            label='Email address'
            placeholder={'eg. example@mail.com'}
            onChange={this.handleIdFill}
            validate={[required, maxLength(64)]}
            connectRight={<Button primary submit disabled={submitDisabled}>Verify Email Address</Button>}
          />
        </form>
        {results && !preSubmit && <SingleResult email={email} valid={valid} reason={reason}/>}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ recipientVerificationLists }) => ({
  errors: recipientVerificationLists.errors,
  results: recipientVerificationLists.results,
  email: recipientVerificationLists.email,
  valid: recipientVerificationLists.valid,
  reason: recipientVerificationLists.reason
});

const WrappedForm = reduxForm({ form: formName })(SingleAddressForm);

export default connect(mapStateToProps, { singleAddress })(WrappedForm);
