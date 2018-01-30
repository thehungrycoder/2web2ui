import React from 'react';
import { connect } from 'react-redux';

import { reduxForm, formValueSelector } from 'redux-form';
import { selectInitialSubaccountValue } from 'src/selectors/webhooks';
import { withRouter } from 'react-router-dom';
import { Button, Panel } from '@sparkpost/matchbox';
import { NameField, TargetField, EventsRadioGroup, AuthDropDown, BasicAuthFields, OAuth2Fields } from './Fields';
import SubaccountSection from './SubaccountSection';
import formatEditValues from '../helpers/formatEditValues';
import buildCheckBoxes from '../helpers/buildCheckBoxes';

const formName = 'webhookForm';

const WebhookForm = ({
  handleSubmit,
  submitting,
  auth,
  eventsRadio,
  eventsTree,
  pristine,
  newWebhook /* passed from CreatePage */
}) => {
  const submitText = submitting ? 'Submitting...' : (newWebhook ? 'Create Webhook' : 'Update Webhook');
  const AuthFields = auth && auth === 'basic' ? BasicAuthFields : OAuth2Fields;
  const showEvents = eventsRadio === 'select';
  const eventBoxes = buildCheckBoxes(eventsTree);
  const disabled = submitting || pristine;

  return (
    <form onSubmit={handleSubmit}>
      <Panel.Section>
        <NameField />
        <TargetField />
      </Panel.Section>
      <Panel.Section>
        <SubaccountSection newWebhook={newWebhook} formName={formName} />
      </Panel.Section>
      <Panel.Section>
        <EventsRadioGroup />
        { showEvents && eventBoxes }
      </Panel.Section>
      <Panel.Section>
        <AuthDropDown />
        { auth && <AuthFields /> }
      </Panel.Section>
      <Panel.Section>
        <Button submit primary disabled={disabled}>{submitText}</Button>
      </Panel.Section>
    </form>
  );
};


const mapStateToProps = (state, props) => {
  const selector = formValueSelector(formName);
  const { eventsRadio, auth } = selector(state, 'eventsRadio', 'auth');
  const webhookValues = props.newWebhook ? {} : formatEditValues(state.webhooks.webhook);

  return {
    eventsRadio,
    auth,
    // subaccountId: selectSubaccountIdFromQuery(state, props),
    initialValues: {
      assignTo: 'master',
      eventsRadio: props.allChecked || props.newWebhook ? 'all' : 'select',
      subaccount: !props.newWebhook ? selectInitialSubaccountValue(state, props) : null,
      ...webhookValues,
      ...props.checkedEvents
    }
  };
};

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default withRouter(connect(mapStateToProps, {})(reduxForm(formOptions)(WebhookForm)));
