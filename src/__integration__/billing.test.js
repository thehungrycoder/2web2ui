import React from 'react';
import { setupForm } from './helpers';
import UpdatePaymentForm from 'src/pages/billing/forms/UpdatePayment';
import axios from 'axios';
const axiosMock = axios.create();

test('Update Payment Form', async () => {
  const form = await setupForm(<UpdatePaymentForm />);

  form.changeFields([
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

  await form.submit();

  expect(axiosMock.mock.calls).toMatchSnapshot();
});
