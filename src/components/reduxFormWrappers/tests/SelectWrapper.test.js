import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import SelectWrapper from '../SelectWrapper';

// options={[{{value: "1", label: "One", pass: "through"}}, {{value: "2", label: "Two"}}]}

cases('SelectWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<SelectWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders select': {
    input: { name: 'example' },
    meta: {},
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ]
  },
  'renders checkbox with an error': {
    input: { name: 'example' },
    meta: {
      active: false,
      error: 'Oh no!',
      touched: true
    },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ]
  }
});
