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
  input: { onChange: jest.fn() },
  plans,
};

const selectedProps = { ...props, input: { ...props.input, value: selected } };

it('renders correctly', () => {
  const wrapper = mount(<PlanPicker {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly with an initial value', () => {
  const wrapper = mount(<PlanPicker {...selectedProps} />);
  expect(wrapper).toMatchSnapshot();
});

it('should focus on input when opened', () => {
  const wrapper = mount(<PlanPicker {...props} />);
  const openSpy = jest.spyOn(wrapper.instance(), 'handleOpen');
  expect(openSpy).not.toHaveBeenCalled();

  // This passes and I have no idea why it works
  wrapper.find(Downshift).node.openMenu();
  wrapper.find('a').at(3).simulate('click');
  expect(openSpy).toHaveBeenCalled();
});
