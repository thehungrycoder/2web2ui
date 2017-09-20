import { mount } from 'enzyme';
import React from 'react';
import Downshift from 'downshift';

import PlanPicker from '../PlanPicker';

const plans = [
  {
    code: '1',
    includesIp: true,
    monthly: 100,
    name: 'One',
    overage: 0.1,
    volume: 1
  },
  {
    code: '2',
    includesIp: false,
    monthly: 0,
    name: 'Two',
    overage: 0.2,
    volume: 2,
    isFree: true
  },
  {
    code: '3',
    monthly: 300,
    name: 'Three',
    overage: 0.3,
    volume: 3,
  },
];

const selected = {
  code: '4',
  monthly: 400,
  name: 'Four',
  overage: 0.4,
  volume: 4,
};

const props = {
  onChange: jest.fn(),
  plans,
};

it('renders correctly', () => {
  const wrapper = mount(<PlanPicker {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with an initial value', () => {
  const wrapper = mount(<PlanPicker {...props} value={selected} />);
  expect(wrapper).toMatchSnapshot();
});
