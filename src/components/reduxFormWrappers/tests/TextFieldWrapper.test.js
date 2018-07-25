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
  },
  'renders with resize=vertical when multiline': {
    input: { name: 'example' },
    meta: {},
    multiline: true
  },
  'allows overriding resize prop with multiline': {
    input: { name: 'example' },
    meta: {},
    multiline: true,
    resize: 'block'
  }
});
