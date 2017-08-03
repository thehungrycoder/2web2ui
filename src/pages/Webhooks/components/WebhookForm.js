import React from 'react';
import { connect } from 'react-redux';

import { Field, reduxForm, formValueSelector } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import CheckboxGroup from './CheckboxGroup';
import { TextFieldWrapper, SelectWrapper, RadioGroup } from '../../../components/reduxFormWrappers';
import { Redirect } from 'react-router-dom';

const required = value => value ? undefined : 'Required';

const basicAuthFields = (
  <div>
  Basic Auth
    <Field name='basicUser' id='basicUser' label='Username' placeholder='username' component={TextFieldWrapper} validate={required}/>

    <Field name='basicPass' id='basicPass' label='Password' placeholder='password' component={TextFieldWrapper} validate={required}/>
  </div>
);

const oAuth2Fields = (
  <div>
  OAuth 2.0
    <Field name='clientId' id='clientId' label='Client ID' placeholder='clientID' component={TextFieldWrapper} validate={required}/>

    <Field name='clientSecret' id='clientSecret' label='Client Secret' placeholder='clientSecret' component={TextFieldWrapper} validate={required}/>

    <Field name='tokenURL' id='tokenURL' label='Token URL' placeholder='https://www.example.com/tokens/' component={TextFieldWrapper} validate={required}/>
  </div>
);

/* Takes in the event tree and builds a grid of checkboxes using the
   CheckboxGroup component */
const buildCheckBoxes = (eventsTree) => {
  const checkboxes = eventsTree.map((parent, index) => {
    const options = parent.events.map((child) => {
      return { label: child.label, value: child.key };
    });

    return (
      <Grid.Column xs={2} lg={2} md={2} key={index}>
        <Field parent={parent.label} name={parent.key} options={options} component={CheckboxGroup} />
      </Grid.Column>
    );
  });

  return (<Grid>{checkboxes}</Grid>);
};

let WebhookForm = props => {
  const { handleSubmit, submitting, auth, eventsRadio, eventsTree, submitSucceeded, webhook, newWebhook } = props;
  const loading = submitting ? (<div>Loading...</div>) : (<div/>);
  const submitText = newWebhook ? 'Create Webhook' : 'Update Webhook';
  const authFields = auth && auth === 'basic' ? basicAuthFields : oAuth2Fields;
  const showEvents = eventsRadio === 'select';
  const eventBoxes = buildCheckBoxes(eventsTree);

  if (newWebhook && submitSucceeded && !submitting && webhook.id) {
    return <Redirect to={`/webhooks/details/${webhook.id}`}/>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field
        // for redux-form
        name='name'
        component={TextFieldWrapper}
        validate={required}

        // for the matchbox component
        id='name'
        label='Webhook Name'
        placeholder='Opens and Clicks'
      />

      <Field
        name='target'
        component={TextFieldWrapper}
        validate={required}

        id='target'
        label='Target URL'
        placeholder='https://www.example.com/target'
        type={'url'}
      />

      <Field
        name='eventsRadio'
        component={RadioGroup}
        title='Events'
        options={[
          {value: 'all', label: 'All'},
          {value: 'select', label: 'Select'}
        ]}
      />

      { showEvents && eventBoxes }

      <br/>

      <Field
        name='auth'
        id='auth'
        label='Authentication'
        component={SelectWrapper}
        options={[{value: '', label: 'None'}, {value: 'basic', label: 'Basic Auth'}, {value: 'oauth2', label: 'OAuth 2.0'}]}
      />

      { auth && authFields }

      <Button submit primary={true} disabled={submitting}>{submitText}</Button>
      { loading }
    </form>
  );
};

const formName = 'webhookForm';

// decorate with redux-form
WebhookForm = reduxForm({
  form: formName
})(WebhookForm);

const selector = formValueSelector(formName);

// TODO: maybe move this to the Edit Page and pass as a prop
const formatEditValues = (webhook) => {
  const values = {
    id: webhook.id,
    name: webhook.name,
    target: webhook.target
  };

  switch (webhook.auth_type) {
    case 'basic':
      values.auth = webhook.auth_type;
      values.basicUser = webhook.auth_credentials.username;
      values.basicPass = webhook.auth_credentials.password;
      break;
    case 'oauth2':
      values.auth = webhook.auth_type;
      values.clientId = webhook.auth_request_details.body.client_id;
      values.clientSecret = webhook.auth_request_details.body.client_secret;
      values.tokenURL = webhook.auth_request_details.url;
      break;
    default:
      break;
  }

  return values;
};

const mapStateToProps = (state, props) => {
  const { name, target, eventsRadio, auth } = selector(state, 'name', 'taget', 'eventsRadio', 'auth');

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
