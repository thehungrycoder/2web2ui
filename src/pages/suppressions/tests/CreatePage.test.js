import React from 'react';
import { shallow } from 'enzyme';

import { CreatePage } from '../CreatePage';

it('renders a create suppression list page', () => {
  const wrapper = shallow(<CreatePage />);
  expect(wrapper).toMatchSnapshot();
});
