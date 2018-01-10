import React from 'react';
import { shallow } from 'enzyme';
import { EngagementPage } from '../EngagementPage';

it('renders engagement report page', () => {
  const wrapper = shallow(<EngagementPage />);
  expect(wrapper).toMatchSnapshot();
});
