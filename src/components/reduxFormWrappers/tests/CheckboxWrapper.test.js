import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import CheckboxWrapper from '../CheckboxWrapper';

cases('CheckboxWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<CheckboxWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders unchecked checkbox': {
    input: { checked: false, name: 'example' },
    meta: {}
  },
  'renders checked checkbox': {
    input: { checked: true, name: 'example' },
    meta: {}
  },
  'renders checkbox with an error': {
    input: { name: 'example' },
    meta: {
      active: false,
      error: 'Oh no!',
      touched: true
    }
  }
});
