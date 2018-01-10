import React, { Component } from 'react';
import { Field, SubmissionError, reduxForm } from 'redux-form';

import _ from 'lodash';

import { Panel, Banner, Button, Error } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required, maxLength, maxFileSize } from 'src/helpers/validation';

import FileInputWrapper from './FileInputWrapper';

import parseRecipientListCsv from '../helpers/csv';

import config from 'src/config';

const formName = 'recipientListForm';

export class RecipientListForm extends Component {
  state = {
    csvErrors: null
  };

  // Parse CSV, store JSON result, collect and show errors
  // and return a top-level CSV field error to show on the form itself.
  parseCsvAndSubmit = (values) => parseRecipientListCsv(values.csv)
    .then((recipients) => {
      const cookedValues = _.omit(values, ['csv']);
      return this.props.onSubmit({
        recipients,
        ...cookedValues
      });
    })
    .catch((csvErrors) => {
      this.setState({ csvErrors });
      throw new SubmissionError({ csv: 'See above for CSV errors' });
    });

  renderBanner() {
    return <Banner status='info' title='Recipient List CSV Format'>
      You can download a <a>CSV template here</a> to use when formatting your recipient list for upload.
    </Banner>;
  }

  renderCsvErrors() {
    return <Banner status='danger' title='CSV Format Errors'>
      {this.state.csvErrors.map((err, idx) => <Error key={idx} error={err}/>)}
    </Banner>;
  }

  render() {
    const { pristine, valid, submitting, handleSubmit } = this.props;
    const { csvErrors } = this.state;

    const disabled = pristine || !valid || submitting;

    return <div>

      { !csvErrors && this.renderBanner() }

      { csvErrors && this.renderCsvErrors() }

      <Panel>
        <Panel.Section>
          <form onSubmit={handleSubmit(this.parseCsvAndSubmit)}>
            <Field
              name='label'
              label='Label'
              placeholder='My favorite recipients'
              validate={[required, maxLength(64)]}
              component={TextFieldWrapper}
            />
            <Field
              name='id'
              label='Identifier'
              placeholder='my-favorite-recipients'
              validate={[required, maxLength(64)]}
              component={TextFieldWrapper}
            />
            <Field
              name='description'
              label='Description'
              placeholder='All my favorite recipients'
              validate={[maxLength(1024)]}
              component={TextFieldWrapper}
            />
            <Field
              name='csv'
              label='Upload a CSV file of recipients'
              validate={[required, maxFileSize(config.maxUploadSizeBytes)]}
              component={FileInputWrapper}
            />
            <Button submit disabled={disabled}>Create Recipient List</Button>
          </form>
        </Panel.Section>
      </Panel>
    </div>;
  }
}

export default reduxForm({ form: formName })(RecipientListForm);
