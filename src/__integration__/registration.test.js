import React from 'react';
import { setupForm } from './helpers';
import JoinPage from '../pages/join/JoinPage';

jest.mock('react-recaptcha', () => {
  const React = require('react');

  class MockRecaptcha extends React.Component {

    reset = () => true;

    componentDidMount() {
      if (this.props.onloadCallback) {
        this.props.onloadCallback();
      }
    }

    execute = () => {
      if (this.props.verifyCallback) {
        this.props.verifyCallback('test-recaptcha-response');
      }
    };

    render = () => true;
  }

  return MockRecaptcha;
});

test('Join Form: Complete Registration', async () => {

  const form = await setupForm(<JoinPage />, { authenticated: false });

  form.fill([
    { name: 'first_name', value: 'Firsty' },
    { name: 'last_name', value: 'Lasty' },
    { name: 'email', value: 'test-email@example.com' },
    { name: 'password', value: 'test-password' },
    { type: 'checkbox', name: 'tou_accepted', value: true }
  ]);

  form.axiosMock.mockClear();
  form.mounted.find('Button').first().simulate('click');
  await form.asyncFlush();

  expect(form.mockApiCalls()).toMatchSnapshot();
});

test('Join Form: Complete Registration w/ email opt-in', async () => {

  const form = await setupForm(<JoinPage />, { authenticated: false });

  form.fill([
    { name: 'first_name', value: 'Firsty' },
    { name: 'last_name', value: 'Lasty' },
    { name: 'email', value: 'test-email@example.com' },
    { name: 'password', value: 'test-password' },
    { type: 'checkbox', name: 'tou_accepted', value: true },
    { type: 'checkbox', name: 'email_opt_in', value: true }
  ]);

  form.axiosMock.mockClear();
  await form.mounted.find('Button').first().simulate('click');
  await form.asyncFlush();

  expect(form.mockApiCalls()).toMatchSnapshot();
});
