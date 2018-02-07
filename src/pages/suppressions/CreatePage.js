import _ from 'lodash';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Button, Page, Panel } from '@sparkpost/matchbox';

import { showAlert } from 'src/actions/globalAlert';
import { uploadSuppressions } from 'src/actions/suppressions';
import ApiErrorBanner from 'src/components/apiErrorBanner/ApiErrorBanner';
import DownloadLink from 'src/components/downloadLink/DownloadLink';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import SubaccountTypeaheadWrapper from 'src/components/reduxFormWrappers/SubaccountTypeaheadWrapper';
import config from 'src/config';
import { fileExtension, fileWithContents, maxFileSize, required } from 'src/helpers/validation';
import exampleSuppressionsListPath from './example-suppressions-list.csv';

export class CreatePage extends Component {

  // Must re-throw Error as SubmissionError for redux form
  handleSubmit = ({ subaccount, suppressionsFile }) => (
    this.props.uploadSuppressions(suppressionsFile, subaccount)
      .then(this.handleSubmitSuccess)
      .catch((error) => { throw new SubmissionError(error); })
  )

  handleSubmitSuccess = () => {
    const { history, showAlert } = this.props;

    showAlert({ message: 'Successfully updated your suppression list', type: 'success' });
    history.push('/lists/suppressions');
  }

  get errorDetails() {
    const { parseError, persistError } = this.props;

    return parseError
      ? parseError.details || parseError.message
      : _.get(persistError, 'response.data.errors[0].message', persistError.message);
  }

  render() {
    const { handleSubmit: reduxFormSubmit, submitFailed, submitting } = this.props;

    return (
      <Page
        title="Add Suppressions"
        breadcrumbAction={{ content: 'Suppressions', Component: Link, to: '/lists/suppressions' }}
      >
        <form onSubmit={reduxFormSubmit(this.handleSubmit)}>
          {!submitting && submitFailed && (
            <ApiErrorBanner
              errorDetails={this.errorDetails}
              message="Unable to upload your list of suppressions"
              status="danger"
            />
          )}
          <Panel title="Upload a List of Suppressions">
            <Panel.Section>
              <Field
                component={FileFieldWrapper}
                disabled={submitting}
                name="suppressionsFile"
                label="Comma Separated Values (CSV) File of Suppressions"
                fileType="csv"
                helpText={
                  <span>
                    You can download
                    an <DownloadLink href={exampleSuppressionsListPath}>example file here</DownloadLink> to
                    use when formatting your list of suppressions for upload.
                  </span>
                }
                required
                validate={[
                  required,
                  fileExtension('csv'),
                  maxFileSize(config.maxUploadSizeBytes),
                  fileWithContents
                ]}
              />
              <Field
                component={SubaccountTypeaheadWrapper}
                disabled={submitting}
                helpText="Leaving this field blank will add the suppressions to the master account."
                name="subaccount"
              />
            </Panel.Section>
            <Panel.Section>
              <Button primary disabled={submitting} type="submit">Upload</Button>
            </Panel.Section>
          </Panel>
        </form>
      </Page>
    );
  }
}

const FORM_NAME = 'uploadSuppressions';
const mapStateToProps = (state) => ({
  persistError: state.suppressions.persistError,
  parseError: state.suppressions.parseError
});

export default withRouter(connect(mapStateToProps, { showAlert, uploadSuppressions })(reduxForm({ form: FORM_NAME })(CreatePage)));
