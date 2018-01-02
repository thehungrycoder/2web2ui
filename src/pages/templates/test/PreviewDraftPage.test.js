import React from 'react';
import { shallow } from 'enzyme';

import { PreviewDraftPage } from '../PreviewDraftPage';

const props = {
  getDraftAndPreview: jest.fn(() => Promise.resolve()),
  match: {
    params: {
      id: 'test-template'
    }
  }
};

afterEach(() => { jest.clearAllMocks(); });

test('renders preview page when loading preview', () => {
  const wrapper = shallow(<PreviewDraftPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test('re-renders preview page after preview is loaded', async() => {
  const wrapper = await shallow(<PreviewDraftPage {...props} />);
  wrapper.update(); // must force a re-render with new state
  expect(wrapper).toMatchSnapshot();
});

test('call .getDraftAndPreview when template has not loaded', () => {
  shallow(<PreviewDraftPage {...props} />);
  expect(props.getDraftAndPreview).toHaveBeenCalledWith('test-template');
});
