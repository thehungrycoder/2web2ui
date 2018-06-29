import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector, Field } from 'redux-form';
import { selectInitialSubaccountValue, getSelectedEvents } from 'src/selectors/webhooks';
import { hasSubaccounts } from 'src/selectors/subaccounts';
import { withRouter } from 'react-router-dom';
import { Button, Panel } from '@sparkpost/matchbox';
import CheckboxWrapper from 'src/components/reduxFormWrappers/CheckboxWrapper';
import { selectEventListing } from 'src/selectors/eventListing';
import { NameField, TargetField, EventsRadioGroup, AuthDropDown, BasicAuthFields, OAuth2Fields, ActiveField } from './Fields';
import SubaccountSection from './SubaccountSection';
import formatEditValues from '../helpers/formatEditValues';
import styles from './WebhookForm.module.scss';

const formName = 'webhookForm';

function EventCheckBoxes({ show, events }) {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.CheckboxGrid}>
      {events.map(({ key, display_name, description, name = `events.${key}` }) => (
        <Field
          key={key}
          label={display_name}
          type="checkbox"
          name={name}
          helpText={description}
          component={CheckboxWrapper}
        />
      ))}
    </div>
  );
}

function AuthFields({ authType }) {
  if (authType === 'basic') {
    return <BasicAuthFields />;
  }
  if (authType === 'oauth2') {
    return <OAuth2Fields />;
  }
  return null;
}

export const WebhookForm = ({
  handleSubmit,
  submitText,
  auth,
  eventListing,
  showEvents,
  disabled,
  initialValues,
  newWebhook, /* passed from CreatePage */
  hasSubaccounts
}) => (
  <form onSubmit={handleSubmit}>
    <Panel.Section>
      <NameField />
      <TargetField />
    </Panel.Section>
    {hasSubaccounts ? <Panel.Section><SubaccountSection newWebhook={newWebhook} formName={formName} /></Panel.Section> : null}
    <Panel.Section>
      <EventsRadioGroup />
      <EventCheckBoxes show={showEvents} events={eventListing} />
    </Panel.Section>
    <Panel.Section>
      <AuthDropDown />
      <AuthFields authType={auth} />
    </Panel.Section>
    {newWebhook ? null : <Panel.Section><ActiveField /></Panel.Section>}
    <Panel.Section>
      <Button submit primary disabled={disabled}>{submitText}</Button>
    </Panel.Section>
  </form>
);


const mapStateToProps = (state, props) => {
  const selector = formValueSelector(formName);
  const { eventsRadio, auth } = selector(state, 'eventsRadio', 'auth');
  const webhookValues = props.newWebhook ? {} : formatEditValues(state.webhooks.webhook);

  return {
    showEvents: eventsRadio === 'select',
    disabled: props.pristine || props.submitting,
    submitText: props.submitting ? 'Submitting...' : (props.newWebhook ? 'Create Webhook' : 'Update Webhook'),
    auth,
    hasSubaccounts: hasSubaccounts(state),
    eventListing: selectEventListing(state),
    initialValues: {
      assignTo: 'all',
      eventsRadio: props.allChecked || props.newWebhook ? 'all' : 'select',
      subaccount: !props.newWebhook ? selectInitialSubaccountValue(state, props) : null,
      ...webhookValues,
      events: getSelectedEvents(state)
    }
  };
};

const formOptions = {
  form: formName,
  enableReinitialize: true
};

export default withRouter(connect(mapStateToProps, {})(reduxForm(formOptions)(WebhookForm)));
