import React from 'react';
import { setupForm } from './helpers';
import axios from 'axios';
import JoinPage from '../pages/join/JoinPage';

const axiosMock = axios.create();

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

  axiosMock.mockClear();
  form.mounted.find('Button').first().simulate('click');
  await form.submit();

  expect(axiosMock.mock.calls).toMatchSnapshot();
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

  axiosMock.mockClear();
  form.mounted.find('Button').first().simulate('click');
  await form.submit();

  expect(axiosMock.mock.calls).toMatchSnapshot();
});
