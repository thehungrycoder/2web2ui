import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { DownloadLink } from 'src/components';
import { required, maxFileSize } from 'src/helpers/validation';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { uploadRecipientVerificationList } from 'src/actions/recipientVerificationLists';
import config from 'src/config';
import exampleRecipientVerificationListPath from './example-recipient-verification-list.csv';

const formName = 'recipientVerificationListForm';

export class RecipientVerificationListForm extends Component {

  createForm = (fields) => {
    const form_data = new FormData();
    form_data.append('myupload', fields.csv);
    return this.props.uploadRecipientVerificationList(form_data);
  }

  render() {
    const { pristine, valid, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    const headerContent = 'Verify a list of your recipients by separating out rejected or undeliverable email addresses.';
    const uploadHint = 'Upload a list of email addresses to verify';
    const uploadValidators = [required, maxFileSize(config.maxRecipVerifUploadSizeBytes)];
    const buttonContent = (submitting) ? 'Uploading...' : 'Verify Email Addresses';

    return (
      <Grid>
        <Grid.Column xs={12} md={8}>
          <form onSubmit={handleSubmit(this.createForm)}>
            <p>{headerContent}</p>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              fileType='csv'
              helpText={<span>Download a <DownloadLink href={exampleRecipientVerificationListPath}>CSV template here</DownloadLink> to use when formatting list.</span>}
              label={uploadHint}
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

export default connect(null, { uploadRecipientVerificationList })(WrappedForm);
