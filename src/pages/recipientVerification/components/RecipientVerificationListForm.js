import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Banner, Button, Error } from '@sparkpost/matchbox';
import { Loading, DownloadLink } from 'src/components';
import styles from './RecipientVerificationPage.module.scss';
import { required, maxFileSize } from 'src/helpers/validation';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { uploadRecipientVerificationList } from 'src/actions/recipientVerificationLists';
import config from 'src/config';
import exampleRecipientVerificationListPath from './example-recipient-verification-list.csv';

const formName = 'recipientVerificationListForm';

export class RecipientVerificationListForm extends Component {

  createForm = (fields) => {
    const form_data = new FormData();
    form_data.append('upload', fields.csv);
    return this.props.uploadRecipientVerificationList(form_data);
  }

  renderCsvErrors() {
    const { error } = this.props;
    return <Banner status='danger' title='CSV Format Errors'>
      {error.map((err, idx) => <Error key={idx} error={err}/>)}
    </Banner>;
  }

  render() {
    const { loading, pristine, valid, error, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    if (loading) {
      return <Loading />;
    }

    const headerContent = 'Verify a list of your recipients by separating deliverable email addresses from rejected or undeliverable email addresses.';
    const uploadHint = 'Upload a list of email addresses to verify';
    const uploadValidators = [required, maxFileSize(config.maxRecipVerifUploadSizeBytes)];
    const buttonContent = (submitting) ? 'Uploading...' : 'Verify Email Addresses';

    return (
      <Fragment>
        {error && this.renderCsvErrors()}
        <form onSubmit={handleSubmit(this.createForm)}>
          <p className={styles.Paragraph}>{headerContent}</p>
          <Field
            component={FileFieldWrapper}
            disabled={submitting}
            fileType='csv'
            helpText={<span>You can download a <DownloadLink href={exampleRecipientVerificationListPath}>CSV template here</DownloadLink> to use when formatting your recipient list for upload.</span>}
            label={uploadHint}
            name='csv'
            validate={uploadValidators}
            required
          />
          <Button primary submit disabled={submitDisabled}>{buttonContent}</Button>
        </form>
      </Fragment>
    );
  }
}

const WrappedForm = reduxForm({ form: formName })(RecipientVerificationListForm);

export default connect(null, { uploadRecipientVerificationList })(WrappedForm);
