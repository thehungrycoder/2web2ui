import React from 'react';
import { setupForm } from './helpers';
import AuthPage from 'src/pages/auth/AuthPage';

test('Login Page: Basic Auth', async () => {

  const form = await setupForm(<AuthPage />, { authenticated: false });

  form.fill([
    { name: 'username', value: 'test-username' },
    { name: 'password', value: 'test-password' }
  ]);

  await form.submit();

  expect(form.mockApiCalls()).toMatchSnapshot();
});

test('Login Page: Basic Auth w/ Remember-Me', async () => {

  const form = await setupForm(<AuthPage />, { authenticated: false });

  form.fill([
    { name: 'username', value: 'test-username' },
    { name: 'password', value: 'test-password' },
    { type: 'checkbox', name: 'rememberMe', value: true }
  ]);

  await form.submit();

  expect(form.mockApiCalls()).toMatchSnapshot();
});
