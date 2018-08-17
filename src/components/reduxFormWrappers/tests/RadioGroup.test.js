import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import RadioGroup from '../RadioGroup';

cases('RadioGroup', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<RadioGroup {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders radio buttons': {
    input: { name: 'example' },
    meta: { },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ],
    title: 'Choose one'
  },
  'renders radio buttons with first option checked': {
    input: { name: 'example', value: 'one' },
    meta: { },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ],
    title: 'Choose one'
  },
  'renders radio buttons with second option disabled': {
    input: { name: 'example' },
    meta: { },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two', disabled: true }
    ],
    title: 'Choose one'
  },
  'renders error state (top)': {
    input: { name: 'example' },
    meta: { touched: true, error: 'error message' },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ],
    title: 'Choose one'
  },
  'renders error state (bottom)': {
    input: { name: 'example' },
    meta: { touched: true, error: 'error message' },
    options: [
      { label: 'Option One', value: 'one' },
      { label: 'Option Two', value: 'two' }
    ],
    title: 'Choose one',
    bottomError: true
  }
});
