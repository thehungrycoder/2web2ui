import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPublishedPage } from '../PreviewPublishedPage';

const props = {
  getPublishedAndPreview: jest.fn(() => Promise.resolve()),
  match: {
    params: {
      id: 'test-template'
    }
  }
};

afterEach(() => { jest.clearAllMocks(); });

test('renders preview page when loading preview', () => {
  const wrapper = shallow(<PreviewPublishedPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test('re-renders preview page after preview is loaded', async() => {
  const wrapper = await shallow(<PreviewPublishedPage {...props} />);
  wrapper.update(); // must force a re-render with new state
  expect(wrapper).toMatchSnapshot();
});

test('call .getPublishedAndPreview when template has not loaded', () => {
  shallow(<PreviewPublishedPage {...props} />);
  expect(props.getPublishedAndPreview).toHaveBeenCalledWith('test-template');
});
