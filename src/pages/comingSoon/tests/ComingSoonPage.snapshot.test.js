import { shallow } from 'enzyme';
import React from 'react';

import ComingSoonPage from '../ComingSoonPage';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ComingSoonPage />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});
