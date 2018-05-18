import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';

import * as supportActions from 'src/actions/support';
import { PageLink, SelectWrapper, TextFieldWrapper } from 'src/components';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import config from 'src/config';
import { hasOnlineSupport } from 'src/helpers/conditions/account';
import { getBase64Contents } from 'src/helpers/file';
import { required, maxFileSize } from 'src/helpers/validation';
import { selectSupportIssue, selectSupportIssues } from 'src/selectors/support';

import styles from './SupportForm.module.scss';

export class SupportForm extends Component {
  onSubmit = async ({ attachment, issueId, message }) => {
    const issue = _.find(this.props.issues, { id: issueId });
    let ticket = { issueType: issue.type, message, subject: issue.label };

    if (attachment) {
      const encoded = await getBase64Contents(attachment);
      ticket = { ...ticket, attachment: { filename: attachment.name, content: encoded }};
    }

    return this.props.createTicket(ticket);
  };

  renderSuccess() {
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

  reset(parentReset) {
    this.props.reset(formName);
    return parentReset();
  }

  renderForm() {
    const {
      handleSubmit,
      invalid,
      issues,
      needsOnlineSupport,
      onCancel,
      pristine,
      selectedIssue,
      submitting,
      toggleSupportPanel
    } = this.props;

    return <div className={styles.SupportForm}>
      <Panel.Section>
        <h6>Submit A Support Ticket</h6>
      </Panel.Section>
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel.Section>
          <Field
            name='issueId'
            label='I need help with...'
            helpText={needsOnlineSupport && (
              <Fragment>
                Additional technical support is available on paid
                plans. <PageLink onClick={toggleSupportPanel} to="/account/billing/plan">Upgrade now</PageLink>.
              </Fragment>
            )}
            errorInLabel
            disabled={submitting}
            component={SelectWrapper}
            options={[
              { disabled: true, label: 'Select an option', value: '' },
              ...issues.map(({ id, label }) => ({ label, value: id }))
            ]}
            validate={required}
          />
          <Field
            name='message'
            label={selectedIssue ? selectedIssue.messageLabel : 'Tell us more about your issue'}
            errorInLabel
            multiline
            resize='none'
            rows={10}
            disabled={submitting}
            component={TextFieldWrapper}
            validate={required}
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
            {submitting ? 'Submitting' : 'Submit Ticket'}
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

export const formName = 'supportForm';
const selector = formValueSelector(formName);
const mapStateToProps = (state) => ({
  issues: selectSupportIssues(state),
  needsOnlineSupport: !hasOnlineSupport(state),
  selectedIssue: selectSupportIssue(state, selector(state, 'issueId')),
  ticketId: state.support.ticketId
});

const ReduxSupportForm = reduxForm({ form: formName })(SupportForm);
export default connect(mapStateToProps, supportActions)(ReduxSupportForm);
