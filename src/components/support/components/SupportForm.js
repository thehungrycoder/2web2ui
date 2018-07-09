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
import { isHeroku } from 'src/helpers/conditions/user';
import { getBase64Contents } from 'src/helpers/file';
import { required, maxFileSize } from 'src/helpers/validation';
import { notAuthorizedToSubmitSupportTickets, selectSupportIssue, selectSupportIssues } from 'src/selectors/support';
import NoIssues from './NoIssues';
import HerokuMessage from './HerokuMessage';

import styles from '../Support.module.scss';

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
    const { onClose, ticketId } = this.props;

    return (
      <div className={styles.SupportContainer}>
        <h6>Your Ticket Has Been Submitted</h6>
        <p>Ticket #{ticketId}</p>
        <p>Please check your email for updates on your support ticket.</p>
        <Button primary onClick={onClose}>Continue</Button>
      </div>
    );
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
      onClose,
      pristine,
      selectedIssue,
      submitting
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <Panel.Section>
          <Field
            name='issueId'
            label='I need help with...'
            helpText={needsOnlineSupport && (
              <Fragment>
                Additional technical support is available on paid
                plans. <PageLink onClick={onClose} to="/account/billing/plan">Upgrade now</PageLink>.
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
        </Panel.Section>
      </form>
    );
  }

  render() {
    const { notAuthorizedToSubmitSupportTickets, openSupportPanel, submitSucceeded, isHeroku } = this.props;

    if (isHeroku) {
      return <HerokuMessage />;
    }

    if (notAuthorizedToSubmitSupportTickets) {
      return <NoIssues onCancel={openSupportPanel} />;
    }

    if (submitSucceeded) {
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
  notAuthorizedToSubmitSupportTickets: notAuthorizedToSubmitSupportTickets(state),
  selectedIssue: selectSupportIssue(state, selector(state, 'issueId')),
  ticketId: state.support.ticketId,
  isHeroku: isHeroku(state)
});

const ReduxSupportForm = reduxForm({ form: formName })(SupportForm);
export default connect(mapStateToProps, supportActions)(ReduxSupportForm);
