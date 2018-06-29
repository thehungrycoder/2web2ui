import React from 'react';
import { setupForm } from './helpers';
import WebhookCreatePage from 'src/pages/webhooks/CreatePage';
import axios from 'axios';
const axiosMock = axios.create();

test('Create Webhook: Defaults', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: Selected Events', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill([
    { name: 'name', value: 'Webhook Test Name' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'eventsRadio', value: 'select' },
    { type: 'checkbox', name: 'events.bounce' },
    { type: 'checkbox', name: 'events.spam_complaint' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: With Basic Auth', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill([
    { name: 'name', value: 'Webhook With Basic Auth' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'select', name: 'auth', value: 'basic' },
    { name: 'basicUser', value: 'my-basic-auth-username' },
    { name: 'basicPass', value: 'my-basic-auth-password' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: With OAuth2', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  form.fill([
    { name: 'name', value: 'Webhook With OAuth2' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'select', name: 'auth', value: 'oauth2' },
    { name: 'clientId', value: 'my-client-id' },
    { name: 'clientSecret', value: 'my-client-secret' },
    { name: 'tokenURL', value: 'https://oauth2.webhooks.com/token' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: Assigned to Master Account', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  // Turn on subaccounts to allow subaccount options to appear
  form.store.dispatch({
    type: 'CREATE_SUBACCOUNT_SUCCESS'
  });

  form.asyncFlush();

  form.fill([
    { name: 'name', value: 'Assigned to Master' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'assignTo', value: 'master' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Create Webhook: Assigned to a Subaccount', async () => {
  const form = await setupForm(<WebhookCreatePage />);

  // Turn on subaccounts to allow subaccount options to appear
  form.store.dispatch({
    type: 'CREATE_SUBACCOUNT_SUCCESS'
  });

  // Load one subaccount
  const subaccount = {
    customer_id: 101,
    id: 577,
    name: 'ada',
    compliance_status: 'active',
    status: 'active'
  };

  form.store.dispatch({
    type: 'LIST_SUBACCOUNTS_SUCCESS',
    payload: [subaccount]
  });

  form.fill([
    { name: 'name', value: 'Assigned to Subaccount' },
    { name: 'target', value: 'https://target.webhooks.com/status/200' },
    { type: 'radio', name: 'assignTo', value: 'subaccount' },
    { type: 'typeahead', name: 'subaccount', value: subaccount }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});
