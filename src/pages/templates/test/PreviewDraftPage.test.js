import React from 'react';
import { shallow } from 'enzyme';

import { PreviewDraftPage } from '../PreviewDraftPage';

it('renders preview page', () => {
  const props = {
    match: {
      params: {
        id: 'test-template'
      }
    }
  };
  const wrapper = shallow(<PreviewDraftPage {...props} />);
  expect(wrapper).toMatchSnapshot();
});
