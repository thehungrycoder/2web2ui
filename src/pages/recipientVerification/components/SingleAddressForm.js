import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, maxLength } from 'src/helpers/validation';
import { singleAddress } from 'src/actions/recipientVerificationLists';
import SingleResult from './SingleResult';

const formName = 'singleAddressForm';
export class SingleAddressForm extends Component {

  singleAddressForm = (values) => this.props.singleAddress(values.address);

  render() {
    const { singleResults, valid, pristine, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;
    const buttonContent = (submitting) ? 'Verifying...' : 'Verify Email Address';

    return (
      <Fragment>
        <form onSubmit={handleSubmit(this.singleAddressForm)}>
          <p>Verify an email address to determine if it is a deliverable email address or a rejected, undeliverable email address.</p>
          <Field
            name='address'
            component={TextFieldWrapper}
            label='Email address'
            placeholder={'eg. example@mail.com'}
            validate={[required, maxLength(64)]}
            normalize={(value = '') => value.trim()}
            connectRight={<Button primary submit disabled={submitDisabled}>{buttonContent}</Button>}
          />
        </form>
        {singleResults && <SingleResult singleResults={singleResults}/>}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ recipientVerificationLists }) => ({
  singleResults: recipientVerificationLists.singleResults
});

const WrappedForm = reduxForm({ form: formName })(SingleAddressForm);

export default connect(mapStateToProps, { singleAddress })(WrappedForm);
