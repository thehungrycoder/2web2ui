import React from 'react';
import { setupForm } from './helpers';
import UpdatePaymentForm from 'src/pages/billing/forms/UpdatePaymentForm';
import UpdateContactForm from 'src/pages/billing/forms/UpdateContactForm';
import ChangePlanForm from 'src/pages/billing/forms/ChangePlanForm';
import axios from 'axios';
const axiosMock = axios.create();

test('Update Payment Form', async () => {
  const form = await setupForm(<UpdatePaymentForm />);

  form.fill([
    { name: 'card.number', value: '4111111111111111' },
    { name: 'card.name', value: 'Person Face' },
    { name: 'card.expCombined', value: '10 / 2022' },
    { name: 'card.securityCode', value: 123 },

    { name: 'billingAddress.firstName', value: 'Firsty' },
    { name: 'billingAddress.lastName', value: 'Lasty' },
    { type: 'select', name: 'billingAddress.country', value: 'US' },
    { type: 'select', name: 'billingAddress.state', value: 'MD' },
    { name: 'billingAddress.zip', value: '12345' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Update Contact Form', async () => {
  const form = await setupForm(<UpdateContactForm onCancel={jest.fn()} />);

  form.fill([
    { name: 'billingContact.firstName', value: 'Firsty' },
    { name: 'billingContact.lastName', value: 'Lasty' },
    { name: 'billingContact.email', value: 'something@email.test' },
    { type: 'select', name: 'billingContact.country', value: 'US' },
    { type: 'select', name: 'billingContact.state', value: 'MD' },
    { name: 'billingContact.zip', value: '12345' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Change Plan Form: Update My Credit Card and Plan', async () => {
  const form = await setupForm(<ChangePlanForm />);
  const newPlan = form.store.getState().billing.plans[2];

  // Click the button to use a different credit card
  form
    .find('Panel[title="Pay With Saved Payment Method"]')
    .find('button').first()
    .simulate('click');

  form.fill([
    { type: 'typeahead', name: 'planpicker', value: newPlan },
    { name: 'card.number', value: '4111111111111111' },
    { name: 'card.name', value: 'Person Face' },
    { name: 'card.expCombined', value: '10 / 2022' },
    { name: 'card.securityCode', value: 123 },

    { name: 'billingAddress.firstName', value: 'Firsty' },
    { name: 'billingAddress.lastName', value: 'Lasty' },
    { type: 'select', name: 'billingAddress.country', value: 'US' },
    { type: 'select', name: 'billingAddress.state', value: 'MD' },
    { name: 'billingAddress.zip', value: '12345' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Change Plan Form: Update Plan Only', async () => {
  const form = await setupForm(<ChangePlanForm />);

  // update the plan picker input (Downshift-specific)
  const newPlan = form.store.getState().billing.plans[2];

  form.fill({ type: 'typeahead', name: 'planpicker', value: newPlan });

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Change Plan Form: Upgrade for the First Time', async () => {
  const form = await setupForm(<ChangePlanForm />);
  const state = form.store.getState();
  const newPlan = state.billing.plans[1];

  form.store.dispatch({
    type: 'FETCH_ACCOUNT_SUCCESS',
    payload: {
      subscription: {
        ...state.account.subscription,
        code: 'free-0817',
        isFree: true,
        monthly: 0
      }
    }
  });

  form.store.dispatch({ type: 'REMOVE_ACCOUNT_BILLING' });

  form.asyncFlush();
  form.mounted.update();

  form.fill([
    { type: 'typeahead', name: 'planpicker', value: newPlan },
    { name: 'card.number', value: '4111111111111111' },
    { name: 'card.name', value: 'Person Face' },
    { name: 'card.expCombined', value: '10 / 2022' },
    { name: 'card.securityCode', value: 123 },

    { name: 'billingAddress.firstName', value: 'Firsty' },
    { name: 'billingAddress.lastName', value: 'Lasty' },
    { type: 'select', name: 'billingAddress.country', value: 'US' },
    { type: 'select', name: 'billingAddress.state', value: 'MD' },
    { name: 'billingAddress.zip', value: '12345' }
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});
