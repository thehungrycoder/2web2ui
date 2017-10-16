import { shallow } from 'enzyme';
import React from 'react';

import { FilterDropdown } from '../FilterDropdown';

const props = {
  formName: 'myForm',
  namespace: 'status',
  displayValue: 'Status',
  change: jest.fn(),
  options: [
    { content: 'Active', name: 'active' },
    { content: 'Terminated', name: 'terminated' },
    { content: 'Suspended', name: 'suspended' }
  ]
};

const e = {
  stopPropagation: jest.fn()
}

let wrapper;

beforeEach(() => {
  wrapper = shallow(<FilterDropdown {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders selected correctly', () => {
  wrapper.setProps({ values: { suspended: true } })
  expect(wrapper).toMatchSnapshot();
});

it('handles click', () => {
  wrapper.setProps({ values: { suspended: true } })
  const changeSpy = jest.spyOn(wrapper.instance().props, 'change')
  const eSpy = jest.spyOn(e, 'stopPropagation')
  wrapper.instance().handleActionClick(e, 'terminated');
  expect(changeSpy).toHaveBeenCalledWith(props.formName, `${props.namespace}.terminated`, true);
  expect(eSpy).toHaveBeenCalled();
});
