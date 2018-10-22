import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, SubmissionError, reduxForm } from 'redux-form';
import { Panel, Banner, Button, Error } from '@sparkpost/matchbox';
import { Loading, DownloadLink } from 'src/components';
import styles from './RecipientVerificationPage.module.scss';
import { required, maxFileSize } from 'src/helpers/validation';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import parseRecipientVerificationListCsv from '../helpers/csv';
import config from 'src/config';
import exampleRecipientVerificationListPath from './example-recipient-verification-list.csv';
import _ from 'lodash';

const formName = 'recipientVerificationListForm';

export class RecipientVerificationListForm extends Component {
  state = {
    selectedTab: 0
  };

  parseCsv = (csv) => parseRecipientVerificationListCsv(csv)
    .catch((csvErrors) => {
      throw new SubmissionError({ _error: csvErrors });
    });

  // `csv` is an internal field. The outer conponent can access the parsed records in `recipients`.
  formatValues = (values) => _.omit(values, ['csv']);

  submitWithRecipients = (values, recipients) => this.props.onSubmit({
    recipients,
    ...this.formatValues(values)
  });

  submitWithoutRecipients = (values) => this.props.onSubmit(this.formatValues(values));

  // Parse CSV, store JSON result, collect and show parsing errors
  preSubmit = (values) => {
    console.log('values.csv', values.csv); //eslint-disable-line no-console
    if (values.csv) {
      // CSV upload is optional in edit mode
      return this.parseCsv(values.csv)
        .then((recipients) => this.submitWithRecipients(values, recipients));
    } else {
      return this.submitWithoutRecipients(this.formatValues(values));
    }
  };

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

    const uploadHint = 'Upload a list of email addresses to verify';
    const uploadValidators = [required, maxFileSize(config.maxUploadSizeBytes)];

    const recipient = 'jim.braman@sparkpost.com';

    // const batchPath = '/recipient-verification';
    // const recipientPath = `/recipient-verification/${recipient}`;

    return (
      // <div>
      //   {error ? this.renderError() : null}
      <Fragment>
        {error && this.renderCsvErrors()}
        <form onSubmit={handleSubmit(this.preSubmit)}>
          <Panel.Section>
            <p className={styles.Paragraph}>Verify a list of your recipients by separating deliverable email addresses from rejected or undeliverable email addresses.</p>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              fileType="csv"
              helpText={
                <span>
                  You can download
                  a <DownloadLink href={exampleRecipientVerificationListPath}>CSV template here</DownloadLink> to
                  use when formatting your recipient list for upload.
                </span>
              }
              label={uploadHint}
              name="csv"
              validate={uploadValidators}
              required
            />
            <Button primary submit disabled={submitDisabled}>Verify Email Addresses</Button>
          </Panel.Section>
        </form>
      </Fragment>
    );
  }
}

const WrappedForm = reduxForm({ form: formName })(RecipientVerificationListForm);

const mapStateToProps = (state, props) => ({
  initialValues: state.recipientVerificationLists.current
});

export default connect(mapStateToProps)(WrappedForm);
