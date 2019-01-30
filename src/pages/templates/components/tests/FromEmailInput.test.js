import React from 'react';
import { shallow } from 'enzyme';
import merge from 'lodash/merge';
import FromEmailInput from '../FromEmailInput';

describe('FromEmailInput', () => {
  const cases = [
    ['renders text field', {}],
    ['renders text field with an error when not open', {
      downshift: {
        isOpen: false
      },
      error: 'Oh no!'
    }],
    ['renders text field without an error when open', {
      downshift: {
        isOpen: true
      },
      error: 'Oh no!'
    }]
  ];

  it.each(cases)('%s', (testName, testProps) => {
    const defaultProps = {
      downshift: {
        getInputProps: jest.fn((obj) => obj)
      },
      value: 'test@example.com'
    };
    const props = merge(defaultProps, testProps);
    const wrapper = shallow(
      <FromEmailInput {...props} />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
