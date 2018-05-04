import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';
import * as supportActions from 'src/actions/support';
import { TextFieldWrapper } from 'src/components';
import { required, minLength, maxFileSize } from 'src/helpers/validation';
import config from 'src/config';
import styles from './SupportForm.module.scss';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { getBase64Contents } from 'src/helpers/file';

const formName = 'supportForm';

export class SupportForm extends Component {
  onSubmit = async (values) => {
    const { message, subject, attachment } = values;
    let ticket = { message, subject };

    if (attachment) {
      const encoded = await getBase64Contents(attachment);
      ticket = { ...ticket, attachment: { filename: attachment.name, content: encoded }};
    }

    return this.props.createTicket(ticket);
  };

  renderSuccess () {
    const { ticketId, onContinue } = this.props;

    return <div className={styles.SupportForm}>
      <div className={styles.SuccessMessage}>
        <h6>Your Ticket Has Been Submitted</h6>
        <p>Ticket # {ticketId}</p>
        <p>Please check your email for updates on your support ticket.</p>
        <Button primary onClick={() => this.reset(onContinue)}>Continue</Button>
      </div>
    </div>;
  }

  reset (parentReset) {
    this.props.reset(formName);
    return parentReset();
  }

  renderForm () {
    const {
      pristine,
      invalid,
      submitting,
      handleSubmit,
      onCancel
    } = this.props;

    return <div className={styles.SupportForm}>
      <Panel.Section>
        <h6>Submit A Support Ticket</h6>
      </Panel.Section>
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel.Section>
          <Field
            name='subject'
            label='Subject'
            placeholder='Give your issue a title'
            autoFocus
            errorInLabel
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
            errorInLabel
            disabled={submitting}
            validate={required}
            component={TextFieldWrapper}
          />
          <Field
            type='file'
            name='attachment'
            label='Attach a file'
            disabled={submitting}
            component={FileFieldWrapper}
            validate={maxFileSize(config.support.maxAttachmentSizeBytes)}
          />
        </Panel.Section>
        <Panel.Section>
          <Button submit primary disabled={pristine || invalid || submitting}>
            {submitting ? 'Saving' : 'Submit Ticket'}
          </Button>
          <Button className={styles.CancelBtn} disabled={submitting} onClick={() => this.reset(onCancel)}>Cancel</Button>
        </Panel.Section>
      </form>
    </div>;
  }

  render () {
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
export default connect(mapStateToProps, supportActions)(ReduxSupportForm);
