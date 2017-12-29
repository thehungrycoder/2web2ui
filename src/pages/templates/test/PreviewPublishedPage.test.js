import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPublishedPage } from '../PreviewPublishedPage';

const props = {
  getPublished: jest.fn(),
  match: {
    params: {
      id: 123
    }
  }
};

afterEach(() => { jest.clearAllMocks(); });

test('renders preview page', () => {
  const wrapper = shallow(<PreviewPublishedPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test('call .getPublished when template has not loaded', () => {
  shallow(<PreviewPublishedPage {...props} />);
  expect(props.getPublished).toHaveBeenCalledWith(123);
});

test('does not call .getPublished when template is loaded', () => {
  shallow(<PreviewPublishedPage {...props} template={{ id: 123 }} />);
  expect(props.getPublished).not.toHaveBeenCalled();
});
