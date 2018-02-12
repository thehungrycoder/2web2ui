import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import TextFieldWrapper from '../TextFieldWrapper';

cases('TextFieldWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<TextFieldWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders text input': {
    input: { name: 'example', value: 'Example Text' },
    meta: {}
  },
  'renders text input with an error': {
    input: { name: 'example' },
    meta: {
      active: false,
      error: 'Oh no!',
      touched: true
    }
  }
});
