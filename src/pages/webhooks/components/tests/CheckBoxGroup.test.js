import React from 'react';
import CheckboxGroup from '../CheckboxGroup';
import { Checkbox } from '@sparkpost/matchbox';
import _ from 'lodash';

const baseProps = {
  input: {
    name: 'myCheckBoxGroup',
    onChange: () => {},
    value: []
  },
  parent: 'parent',
  options: [
    { label: 'First', value: 'one'},
    { label: 'Second', value: 'two'}
  ]
};

it('should render a CheckBoxGroup, no children', () => {
    const wrapper = shallow(<CheckboxGroup {...baseProps} />);

    expect(wrapper).toMatchSnapshot();
});

it('should check one child', () => {
    const props = _.cloneDeep(baseProps);
    props.input.value = ['one'];

    const wrapper = shallow(<CheckboxGroup {...props} />);

    expect(wrapper).toMatchSnapshot();
});

it('should check all children and check parent', () => {
    const props = _.cloneDeep(baseProps);
    props.input.value = ['one', 'two'];

    const wrapper = shallow(<CheckboxGroup {...props} />);

    expect(wrapper).toMatchSnapshot();
});
