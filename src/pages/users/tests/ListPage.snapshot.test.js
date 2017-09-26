import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

const props = {};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ListPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

xit('renders errors when present');
