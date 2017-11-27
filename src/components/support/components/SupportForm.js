import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import { Button, Panel } from '@sparkpost/matchbox';

import { TextFieldWrapper } from 'src/components';

import { required, minLength } from 'src/helpers/validation';

const formName = 'supportForm';

class SupportForm extends Component {
  renderSuccess() {
    const { submitFailed, ticketId, onContinue } = this.props;

    if (submitFailed) {
      return null;
    }

    return <div>
        <Panel.Section style={{ textAlign: 'center', paddingTop: '160px' }}>
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

  renderForm() {
    const {
        pristine,
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
                name='message'
                label='Message'
                placeholder='Give us details about your issue'
                disabled={submitting}
                validate={[required, minLength(20)]}
                component={TextFieldWrapper}
              />
              {/*<Button size='small'>Upload a file</Button>*/}
            </Panel.Section>
            <Panel.Section>
              <Button submit primary disabled={submitting || pristine}>
                  {submitting ? 'Saving' : 'Submit Ticket' }
              </Button>
              <Button disabled={submitting} onClick={() => this.reset(onCancel)} style={{ float: 'right' }}>Cancel</Button>
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

const mapStateToProps = () => ({
  initialValues: {
    subject: 'EQD test subject',
    message: 'EQD is testing again: real message goes here'
  }
});

const ReduxSupportForm = reduxForm({ form: formName })(SupportForm);
export default connect(mapStateToProps)(ReduxSupportForm);

