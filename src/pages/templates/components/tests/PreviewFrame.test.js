import React from 'react';
import { mount } from 'enzyme';

import PreviewFrame from '../PreviewFrame';

const testContent = '<h1>Hello, World!</h1>';
const createWrapper = (content, contentDocument = {}) => {
  // This is an experimental way to mock a class method
  // @see https://github.com/facebook/react/issues/9396
  class MockPreviewFrame extends PreviewFrame {
    // Must set the display name for snapshots
    static displayName = 'PreviewFrame';

    // Mock setting iframe ref
    // @note Tried mocking contentWindow with jsdom, but didn't provide add value, so removed dep
    setRef = (iframe) => {
      this.iframe = {
        contentWindow: {
          document: {
            close: jest.fn(),
            open: jest.fn(),
            write: jest.fn(),
            ...contentDocument
          }
        }
      };
    }
  }

  return mount(<MockPreviewFrame content={content} />);
};


test('renders an iframe', () => {
  const wrapper = createWrapper(testContent);
  expect(wrapper).toMatchSnapshot();
});

test('writes content to iframe document', () => {
  const write = jest.fn();
  createWrapper(testContent, { write });
  expect(write).toHaveBeenCalledWith(testContent);
});

test('sets iframe height after it loads', () => {
  const wrapper = createWrapper(testContent, {
    body: {
      offsetHeight: '99',
      style: {}
    }
  });

  wrapper.instance().onLoad();
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});
