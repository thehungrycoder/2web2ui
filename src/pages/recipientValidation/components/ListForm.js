import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { DownloadLink } from 'src/components';
import { required, maxFileSize } from 'src/helpers/validation';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { uploadList } from 'src/actions/recipientValidation';
import { showAlert } from 'src/actions/globalAlert';
import config from 'src/config';
import exampleRecipientValidationListPath from './example-recipient-validation-list.csv';

const formName = 'recipientValidationListForm';

export class ListForm extends Component {

  handleUpload = (fields) => {
    const { uploadList, showAlert, reset } = this.props;
    const form_data = new FormData();

    form_data.append('myupload', fields.csv);
    return uploadList(form_data).then(() => {
      showAlert({ type: 'success', message: 'Recipients Uploaded' });
      reset(formName);
    });
  }

  render() {
    const { pristine, valid, submitting, handleSubmit } = this.props;
    const submitDisabled = pristine || !valid || submitting;

    const headerContent = 'Validate a list of your recipients by separating out rejected or undeliverable email addresses.';
    const fileTypes = ['.txt','.csv'];
    const uploadValidators = [required, maxFileSize(config.maxRecipVerifUploadSizeBytes)];
    const buttonContent = (submitting) ? 'Uploading...' : 'Validate Email Addresses';

    return (
      <Grid>
        <Grid.Column xs={12} md={8}>
          <form onSubmit={handleSubmit(this.handleUpload)}>
            <p>{headerContent}</p>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              fileTypes={fileTypes}
              helpText={<span>File must be a line delimited list of addresses. Download a <DownloadLink href={exampleRecipientValidationListPath}>CSV template here</DownloadLink> to use when formatting list.</span>}
              name='csv'
              validate={uploadValidators}
              labelHidden
              placeholder='Drag a line delimited CSV here, or click to browse'
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

const WrappedForm = reduxForm({ form: formName })(ListForm);

export default connect(null, { uploadList, showAlert })(WrappedForm);
