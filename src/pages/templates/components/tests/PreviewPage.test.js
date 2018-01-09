import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import PreviewPage from '../PreviewPage';

// Load a preview page with a test template and return for additional operations
const loadPreviewPage = async(overrides = {}) => {
  const props = {
    match: { params: { id: 'test-template' }},
    mode: 'draft',
    onLoad: () => Promise.resolve(),
    preview: {
      from: { email: 'test@example.com' },
      subject: 'Test Template',
      html: '<h1>Test Template</h1>'
    },
    returnPath: '/path/to/return',
    template: {
      id: 'test-template',
      name: 'Test Template'
    }
  };

  const wrapper = shallow(<PreviewPage {...props} {...overrides} />);

  // manually load, so we can wait for it to complete
  await wrapper.instance().onLoad();

  // re-render after onLoad completes
  wrapper.update();

  return wrapper;
};

it('renders preview page with template', async() => {
  const wrapper = await loadPreviewPage();
  expect(wrapper).toMatchSnapshot();
});

it('renders loading page and makes request for preview', () => {
  const id = 'test-template';
  const props = {
    match: { params: { id }},
    onLoad: jest.fn(() => Promise.resolve())
  };
  const wrapper = shallow(<PreviewPage {...props} />);

  expect(props.onLoad).toHaveBeenCalledWith(id);
  expect(wrapper).toMatchSnapshot();
});

it('renders loading error', async() => {
  const wrapper = await loadPreviewPage({
    onLoad: () => Promise.reject(new Error('Oh no!'))
  });
  expect(wrapper).toMatchSnapshot();
});


it('resets error message when user starts typing again', async() => {
  const event = { currentTarget: { value: 'new@example.com' }};
  const wrapper = await loadPreviewPage();

  wrapper.setState({ validationError: 'Something went wrong' });
  wrapper.find({ label: 'To' }).simulate('change', event);

  expect(wrapper).toMatchSnapshot();
});


cases('displays error', async({ to }) => {
  const wrapper = await loadPreviewPage();

  wrapper.setState({ to });
  wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(wrapper.state('validationError')).toBeDefined();
}, {
  'with blank string': { to: ' ' },
  'with an invalid email': { to: 'invalid@' },
  'with any invalid email': { to: 'test@example, invalid@' },
  'with trailing comma': { to: 'test@example,' }
});

it('successfully sends email and shows global alert', async() => {
  const props = {
    sendPreview: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn()
  };
  const wrapper = await loadPreviewPage(props);

  wrapper.setState({ to: 'recipient@example.com' });
  await wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(props.sendPreview).toHaveBeenCalledWith({
    emails: ['recipient@example.com'],
    from: 'test@example.com',
    id: 'test-template',
    mode: 'draft'
  });
  expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  expect(wrapper.state()).toMatchSnapshot();
});

it('failed to send email and shows global alert', async() => {
  const props = {
    sendPreview: jest.fn(() => Promise.reject(new Error('Oh no!'))),
    showAlert: jest.fn()
  };
  const wrapper = await loadPreviewPage(props);

  wrapper.setState({ to: 'recipient@example.com' });
  await wrapper.instance().onSend(); // unable to .find primary action button with shallow

  expect(props.showAlert).toHaveBeenCalledWith({ message: 'Oh no!', type: 'error' });
  expect(wrapper.state()).toMatchSnapshot();
});
