import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';

import { showAlert } from 'src/actions/globalAlert';
import { uploadSuppressions } from 'src/actions/suppressions';
import DownloadLink from 'src/components/downloadLink/DownloadLink';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import SubaccountTypeaheadWrapper from 'src/components/reduxFormWrappers/SubaccountTypeaheadWrapper';
import config from 'src/config';
import { fileExtension, maxFileSize, nonEmptyFile, required } from 'src/helpers/validation';
import exampleSuppressionsListPath from './example-suppressions-list.csv';


export class UploadTab extends Component {
  handleSubmit = ({ subaccount, suppressionsFile }) => {
    this.props.uploadSuppressions(suppressionsFile, subaccount)
      .then(this.handleSubmitSuccess)
      .catch(() => {
        // do nothing
      });
  }

  handleSubmitSuccess = () => {
    const { history, showAlert } = this.props;

    showAlert({ message: 'Successfully updated your suppression list', type: 'success' });
    history.push('/lists/suppressions');
  }

  render() {
    const { handleSubmit: reduxFormSubmit, submitting } = this.props;
    return (
      <Fragment>
        <form onSubmit={reduxFormSubmit(this.handleSubmit)}>
          <Panel.Section>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              name="suppressionsFile"
              label="CSV File of Suppressions"
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
                nonEmptyFile
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
        </form>
      </Fragment>
    );

  }
}

const FORM_NAME = 'uploadSuppressions';
const mapStateToProps = (state) => ({
  persistError: state.suppressions.persistError,
  parseError: state.suppressions.parseError
});

export default withRouter(connect(mapStateToProps, { showAlert, uploadSuppressions })(reduxForm({ form: FORM_NAME })(UploadTab)));

