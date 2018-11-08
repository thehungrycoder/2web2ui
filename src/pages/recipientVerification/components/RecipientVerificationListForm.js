import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { DownloadLink } from 'src/components';
import { required, maxFileSize, fileExtension } from 'src/helpers/validation';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { uploadRecipientVerificationList } from 'src/actions/recipientVerificationLists';
import { showAlert } from 'src/actions/globalAlert';
import config from 'src/config';
import exampleRecipientVerificationListPath from './example-recipient-verification-list.csv';

const formName = 'recipientVerificationListForm';

export class RecipientVerificationListForm extends Component {

  handleUpload = (fields) => {
    const { uploadRecipientVerificationList, showAlert, reset } = this.props;
    const form_data = new FormData();

    form_data.append('myupload', fields.csv);
    return uploadRecipientVerificationList(form_data).then(() => {
      showAlert({ type: 'success', message: 'Recipients Uploaded' });
      reset(formName);
    });
  }

  render() {
    const { pristine, valid, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    const headerContent = 'Verify a list of your recipients by separating out rejected or undeliverable email addresses.';
    const uploadValidators = [required, fileExtension('csv'), maxFileSize(config.maxRecipVerifUploadSizeBytes)];
    const buttonContent = (submitting) ? 'Uploading...' : 'Verify Email Addresses';

    return (
      <Grid>
        <Grid.Column xs={12} md={8}>
          <form onSubmit={handleSubmit(this.handleUpload)}>
            <p>{headerContent}</p>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              fileType='csv'
              helpText={<span>Download a <DownloadLink href={exampleRecipientVerificationListPath}>CSV template here</DownloadLink> to use when formatting list.</span>}
              name='csv'
              validate={uploadValidators}
              labelHidden
              placeholder='Drag a CSV here, or click to browse'
              style={{
                paddingTop: '3rem',
                paddingBottom: '3rem'
              }}
            />
            <Button primary submit disabled={submitDisabled}>{buttonContent}</Button>
          </form>
        </Grid.Column>
      </Grid>
    );
  }
}

const WrappedForm = reduxForm({ form: formName })(RecipientVerificationListForm);

export default connect(null, { uploadRecipientVerificationList, showAlert })(WrappedForm);
