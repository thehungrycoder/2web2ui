import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import PreviewPage from '../PreviewPage';

const DEFAULT_PROPS = {
  editTemplatePath: '/path/to/edit',
  loading: false,
  mode: 'draft',
  preview: {
    from: {
      email: 'test@example.com'
    },
    html: '<html />',
    subject: 'Test Subject'
  },
  template: {
    id: 'test-template',
    name: 'Test Template'
  }
};

it('renders loading page when template is undefined', () => {
  const wrapper = shallow(<PreviewPage loading />);
  expect(wrapper).toMatchSnapshot();
});

it('renders preview page', () => {
  const wrapper = shallow(<PreviewPage {...DEFAULT_PROPS} />);
  expect(wrapper).toMatchSnapshot();
});

it('clears "To" field error and updates "To" field value', () => {
  const event = { currentTarget: { value: 'new@example.com' }};
  const wrapper = shallow(<PreviewPage {...DEFAULT_PROPS} />);

  wrapper.setState({ error: 'Something went wrong' });
  wrapper.find({ label: 'To' }).simulate('change', event);

  expect(wrapper).toMatchSnapshot();
});

cases('displays error', ({ to }) => {
  const wrapper = shallow(<PreviewPage {...DEFAULT_PROPS} />);

  wrapper.setState({ to });
  wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(wrapper.state('error')).toBeDefined();
}, {
  'with blank string': { to: ' ' },
  'with an invalid email': { to: 'invalid@' },
  'with any invalid email': { to: 'test@example, invalid@' },
  'with trailing comma': { to: 'test@example,' }
});

it('successfully sends email and shows global alert', async() => {
  const props = {
    ...DEFAULT_PROPS,
    sendPreview: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn()
  };
  const wrapper = shallow(<PreviewPage {...props} />);

  wrapper.setState({ to: 'recipient@example.com' });
  await wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(props.sendPreview).toHaveBeenCalledWith({
    emails: ['recipient@example.com'],
    from: 'test@example.com',
    id: 'test-template',
    mode: 'draft'
  });
  expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  expect(wrapper.state()).toEqual({ sending: false, to: '' });
});

it('failed to send email and shows global alert', async() => {
  const props = {
    ...DEFAULT_PROPS,
    sendPreview: jest.fn(() => Promise.reject(new Error('Oh no!'))),
    showAlert: jest.fn()
  };
  const wrapper = shallow(<PreviewPage {...props} />);

  wrapper.setState({ to: 'recipient@example.com' });
  await wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(props.showAlert).toHaveBeenCalledWith({ message: 'Oh no!', type: 'error' });
  expect(wrapper.state()).toEqual({ sending: false, to: 'recipient@example.com' });
});
