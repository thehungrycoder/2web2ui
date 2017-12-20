import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';

import { TextFieldWrapper } from 'src/components';

import { required, minLength, maxFileSize } from 'src/helpers/validation';

import FileInput from './FileInput';

import styles from './SupportForm.module.scss';

const formName = 'supportForm';

const fileSizeLimit = 1024;

export class SupportForm extends Component {
  renderSuccess() {
    const { submitFailed, ticketId, onContinue } = this.props;

    if (submitFailed) {
      return null;
    }

    return <div>
        <Panel.Section className='SuccessMessage' style={{ textAlign: 'center', paddingTop: '160px' }}>
          <h6>Your ticket has been submitted</h6>
          <div><small>Ticket # {ticketId}</small></div>
          <div><small>Please check your email for updates on your support ticket.</small></div>
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

  renderAttachmentField = (props) => <FileInput {...props}>Attach a file</FileInput>;

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
            <h6>Submit a ticket</h6>
          </Panel.Section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Panel.Section>
              <Field
                name='subject'
                label='Subject'
                placeholder='Give your issue a title'
                disabled={submitting}
                validate={[required, minLength(5)]}
                component={TextFieldWrapper} />
              <Field
                multiline
                rows={10}
                className={styles.Message}
                name='message'
                label='Message'
                placeholder='Give us details about your issue'
                disabled={submitting}
                validate={[required, minLength(20)]}
                component={TextFieldWrapper}
              />
              <Field
                type='file'
                name='attachment'
                label='Attachment'
                component={this.renderAttachmentField}
                validate={maxFileSize(fileSizeLimit)}
              />
            </Panel.Section>
            <Panel.Section>
              <Button submit primary disabled={pristine || invalid || submitting}>
                  {submitting ? 'Saving' : 'Submit Ticket' }
              </Button>
              <Button className="CancelBtn" disabled={submitting} onClick={() => this.reset(onCancel)} style={{ float: 'right' }}>Cancel</Button>
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

