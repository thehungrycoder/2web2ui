import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';

import { TextFieldWrapper } from 'src/components';

import { required, minLength, maxFileSize } from 'src/helpers/validation';

import FileInput from './FileInput';

import styles from './SupportForm.module.scss';

const formName = 'supportForm';

// 1MB limit for attachments into Desk.
const fileSizeLimit = 1024 * 1024;

const AttachmentField = (props) => <FileInput {...props}>Attach a file</FileInput>;

export class SupportForm extends Component {
  renderSuccess() {
    const { ticketId, onContinue } = this.props;

    return <div>
        <Panel.Section className={styles.SuccessMessage}>
            <h6>Your Ticket Has Been Submitted</h6>
            <div>Ticket # {ticketId}</div>
            <div>Please check your email for updates on your support ticket.</div>
            <div style={{ paddingTop: '40px' }}>
              <Button primary onClick={() => this.reset(onContinue)}>Continue</Button>
            </div>
        </Panel.Section>
      </div>;
  }

  reset(parentReset) {
    this.props.reset(formName);
    return parentReset();
  }


  renderForm() {
    const {
        pristine,
        invalid,
        submitting,
        submitSucceeded,
        handleSubmit,
        onSubmit,
        onCancel
      } = this.props;

    if (submitSucceeded) {
      return null;
    }

    return <div>
          <Panel.Section>
            <h6>Submit A Support Ticket</h6>
          </Panel.Section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Panel.Section>
              <Field
                name='subject'
                label='Subject'
                placeholder='Give your issue a title'
                inlineErrors={true}
                disabled={submitting}
                validate={[required, minLength(5)]}
                component={TextFieldWrapper} />
              <Field
                multiline
                rows={10}
                resize='none'
                name='message'
                label='Message'
                placeholder='Give us details about your issue'
                inlineErrors={true}
                disabled={submitting}
                validate={[required, minLength(20)]}
                component={TextFieldWrapper}
              />
              <Field
                type='file'
                name='attachment'
                label='Attachment'
                component={AttachmentField}
                validate={maxFileSize(fileSizeLimit)}
              />
            </Panel.Section>
            <Panel.Section>
              <Button submit primary disabled={pristine || invalid || submitting}>
                  {submitting ? 'Saving' : 'Submit Ticket' }
              </Button>
              <Button className={styles.CancelBtn} disabled={submitting} onClick={() => this.reset(onCancel)}>Cancel</Button>
            </Panel.Section>
          </form>
        </div>;
  }

  render() {
    if (this.props.submitSucceeded) {
      return this.renderSuccess();
    }
    return this.renderForm();
  }
}

const mapStateToProps = ({ support }) => ({
  ticketId: support.ticketId
});

const ReduxSupportForm = reduxForm({ form: formName })(SupportForm);
export default connect(mapStateToProps)(ReduxSupportForm);

