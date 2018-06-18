import React from 'react';
import { setupForm } from './helpers';
import UpdatePaymentForm from 'src/pages/billing/forms/UpdatePaymentForm';
import UpdateContactForm from 'src/pages/billing/forms/UpdateContactForm';
import ChangePlanForm from 'src/pages/billing/forms/ChangePlanForm';
import axios from 'axios';
const axiosMock = axios.create();

// prevent problems with trying to load google analytics stuff
jest.mock('src/helpers/analytics');

test('Update Payment Form', async () => {
  const form = await setupForm(<UpdatePaymentForm />);

  form.fill([
    '4111111111111111',
    'Person Face',
    '10 / 2022',
    123,
    'Firsty',
    'Lasty',
    'US',
    'MD',
    '12345'
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Update Contact Form', async () => {
  const form = await setupForm(<UpdateContactForm onCancel={jest.fn()} />);

  form.fill([
    'Firsty',
    'Lasty',
    'something@email.test',
    'US',
    'MD',
    '12345'
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
    newPlan,
    '4111111111111111',
    'Person Face',
    '10 / 2022',
    123,
    'Firsty',
    'Lasty',
    'US',
    'MD',
    '12345'
  ]);

  form.find('Downshift').props().onChange(newPlan);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Change Plan Form: Update Plan Only', async () => {
  const form = await setupForm(<ChangePlanForm />);

  // update the plan picker input (Downshift-specific)
  const newPlan = form.store.getState().billing.plans[2];

  form.fill([
    newPlan
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});

test('Change Plan Form: Upgrade for the First Time', async () => {
  const form = await setupForm(<ChangePlanForm />);
  const state = form.store.getState();
  const { billing, ...account } = state.account;
  const newPlan = state.billing.plans[1];

  form.store.dispatch({
    type: 'FETCH_ACCOUNT_SUCCESS',
    payload: {
      ...account,
      subscription: {
        ...state.account.subscription,
        code: 'free-0817',
        isFree: true,
        monthly: 0
      }
    }
  });

  form.asyncFlush();
  form.mounted.update();

  form.fill([
    newPlan,
    '4111111111111111',
    'Person Face',
    '10 / 2022',
    123,
    'Firsty',
    'Lasty',
    'US',
    'MD',
    '12345'
  ]);

  axiosMock.mockClear();
  await form.submit();
  expect(axiosMock.mock.calls).toMatchSnapshot();
});
