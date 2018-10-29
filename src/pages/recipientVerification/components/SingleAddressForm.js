import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { Loading, TextFieldWrapper } from 'src/components';
import styles from './RecipientVerificationPage.module.scss';
import { required, maxLength } from 'src/helpers/validation';

const formName = 'singleAddressForm';

export class SingleAddressForm extends Component {

  render() {
    const { loading, pristine, valid, submitting, handleSubmit } = this.props;

    const submitDisabled = pristine || !valid || submitting;


    if (loading) {
      return <Loading />;
    }

    return (
      <Fragment>
        <form onSubmit={handleSubmit}>
          <p className={styles.Paragraph}>Verify an email address to determine if it is a deliverable email address or a rejected, undeliverable email address.</p>
          <Field
            name='name'
            component={TextFieldWrapper}
            label='Enter an email address to verify'
            placeholder={'eg. example@mail.com'}
            onChange={this.handleIdFill}
            validate={[required, maxLength(64)]}
          />
          <Button primary submit disabled={submitDisabled}>Verify Email Address</Button>
        </form>
      </Fragment>
    );
  }
}

const WrappedForm = reduxForm({ form: formName })(SingleAddressForm);

const mapStateToProps = (state, props) => ({
  initialValues: props.editMode ? state.recipientLists.current : {}
});

export default connect(mapStateToProps)(WrappedForm);
