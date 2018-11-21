import React from 'react';
import { setupForm } from './helpers';
import AuthPage from 'src/pages/auth/AuthPage';
import axios from 'axios';
const axiosMock = axios.create();

test('Login Page: Basic Auth', async () => {

  const form = await setupForm(<AuthPage />, { authenticated: false });

  form.fill([
    { name: 'username', value: 'test-username' },
    { name: 'password', value: 'test-password' }
  ]);

  axiosMock.mockClear();
  await form.submit();

  expect(axiosMock.mock.calls).toMatchSnapshot();
});
