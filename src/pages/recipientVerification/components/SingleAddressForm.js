import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import styles from './RecipientVerificationPage.module.scss';
import { required, maxLength } from 'src/helpers/validation';
import { singleAddress } from 'src/actions/recipientVerificationLists';
import SingleResult from './SingleResult';

const formName = 'singleAddressForm';
export class SingleAddressForm extends Component {

  singleAddressForm = (values) => this.props.singleAddress(values.address);

  render() {
    const { pristine, email, valid, reason, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    return (
      <Fragment>
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
        {(valid) ? <SingleResult email={email} valid={valid} reason={reason}/> : <p>null</p>}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ recipientVerificationLists }) => ({
  email: recipientVerificationLists.email,
  valid: recipientVerificationLists.valid,
  reason: recipientVerificationLists.reason
});

const WrappedForm = reduxForm({ form: formName })(SingleAddressForm);

export default connect(mapStateToProps, { singleAddress })(WrappedForm);
