import React from 'react';
import { shallow } from 'enzyme';

import RecipientListsListHeader from '../RecipientListsListHeader';

it('should render', () => {
  const wrapper = shallow(<RecipientListsListHeader />);
  expect(wrapper).toMatchSnapshot();
});
