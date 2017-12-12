import React from 'react';
import { connect } from 'react-redux';

import { reduxForm, formValueSelector } from 'redux-form';
import { Button } from '@sparkpost/matchbox';
import { Redirect } from 'react-router-dom';
import { NameField, TargetField, EventsRadioGroup, AuthDropDown, BasicAuthFields, OAuth2Fields } from './Fields';
import formatEditValues from '../helpers/formatEditValues';
import buildCheckBoxes from '../helpers/buildCheckBoxes';

let WebhookForm = (props) => {
  const {
    handleSubmit,
    submitting,
    auth,
    eventsRadio,
    eventsTree,
    submitSucceeded,
    pristine,
    webhook, /* taken from state       */
    newWebhook /* passed from CreatePage */
  } = props;

  if (newWebhook && submitSucceeded && !submitting && webhook.id) {
    return <Redirect to={`/webhooks/details/${webhook.id}`}/>;
  }

  const submitText = newWebhook ? 'Create Webhook' : 'Update Webhook';
  const AuthFields = auth && auth === 'basic' ? BasicAuthFields : OAuth2Fields;
  const showEvents = eventsRadio === 'select';
  const eventBoxes = buildCheckBoxes(eventsTree);
  const disabled = submitting || pristine;

  return (
    <form onSubmit={handleSubmit}>
      <NameField />
      <TargetField />
      <EventsRadioGroup />
      { showEvents && eventBoxes }

      <br/>

      <AuthDropDown />
      { auth && <AuthFields /> }

      <Button submit primary={true} disabled={disabled}>{submitText}</Button>
      { submitting && !submitSucceeded && <div>Loading...</div>}
    </form>
  );
};

const formName = 'webhookForm';

// decorate with redux-form
WebhookForm = reduxForm({
  form: formName
})(WebhookForm);

const selector = formValueSelector(formName);

const mapStateToProps = (state, props) => {
  const { name, target, eventsRadio, auth } = selector(state, 'name', 'target', 'eventsRadio', 'auth');
  const webhookValues = props.newWebhook ? {} : formatEditValues(state.webhooks.webhook);

  return {
    name,
    target,
    eventsRadio,
    auth,
    webhook: state.webhooks.webhook,
    initialValues: {
      eventsRadio: props.allChecked || props.newWebhook ? 'all' : 'select',
      ...webhookValues,
      ...props.checkedEvents
    }
  };
};

WebhookForm = connect(mapStateToProps)(WebhookForm);

export default WebhookForm;
