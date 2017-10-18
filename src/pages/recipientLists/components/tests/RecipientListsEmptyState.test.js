import React from 'react';
import { shallow } from 'enzyme';

import RecipientListsEmptyState from '../RecipientListsEmptyState';

it('should render', () => {
  const wrapper = shallow(<RecipientListsEmptyState />);
  expect(wrapper).toMatchSnapshot();
});
