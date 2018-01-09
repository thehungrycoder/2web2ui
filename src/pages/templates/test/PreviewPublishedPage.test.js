import React from 'react';
import { shallow } from 'enzyme';

import { PreviewPublishedPage } from '../PreviewPublishedPage';

it('renders preview page', () => {
  const props = {
    match: {
      params: {
        id: 'test-template'
      }
    }
  };
  const wrapper = shallow(<PreviewPublishedPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});
