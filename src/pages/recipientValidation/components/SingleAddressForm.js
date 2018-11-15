import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, email, maxLength } from 'src/helpers/validation';
import { singleAddress } from 'src/actions/recipientValidation';
import SingleResult from './SingleResult';

const formName = 'singleAddressForm';
export class SingleAddressForm extends Component {

  singleAddressForm = (values) => this.props.singleAddress(values.address);

  render() {
    const { singleResults, valid, pristine, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;
    const buttonContent = (submitting) ? 'Validating...' : 'Validate';

    return (
      <Fragment>
        <form onSubmit={handleSubmit(this.singleAddressForm)}>
          <p>Validate an email address to determine if it is a deliverable email address or a rejected, undeliverable email address.</p>
          <Field
            name='address'
            component={TextFieldWrapper}
            label='Email address'
            placeholder={'eg. example@mail.com'}
            validate={[required, email, maxLength(254)]}
            normalize={(value = '') => value.trim()}
            connectRight={<Button primary submit disabled={submitDisabled}>{buttonContent}</Button>}
          />
        </form>
        {singleResults && <SingleResult singleResults={singleResults}/>}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ recipientValidation }) => ({
  singleResults: recipientValidation.singleResults
});

const WrappedForm = reduxForm({ form: formName })(SingleAddressForm);

export default connect(mapStateToProps, { singleAddress })(WrappedForm);
