import React from 'react';
import { shallow } from 'enzyme';

import { PreviewDraftPage } from '../PreviewDraftPage';

const props = {
  getDraft: jest.fn(),
  match: {
    params: {
      id: 123
    }
  }
};

afterEach(() => { jest.clearAllMocks(); });

test('renders preview page', () => {
  const wrapper = shallow(<PreviewDraftPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});

test('call .getDraft when template has not loaded', () => {
  shallow(<PreviewDraftPage {...props} />);
  expect(props.getDraft).toHaveBeenCalledWith(123);
});

test('does not call .getDraft when template is loaded', () => {
  shallow(<PreviewDraftPage {...props} template={{ id: 123 }} />);
  expect(props.getDraft).not.toHaveBeenCalled();
});
