import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import DatePickerWrapper from '../DatePickerWrapper';

cases('DatePickerWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<DatePickerWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders correctly': {
    input: {
      value: {
        to: new Date('2018-01-01T12:00:00Z'),
        from: new Date('2018-01-01T12:00:00Z')
      },
      name: 'example',
      onChange: jest.fn()
    },
    meta: {}
  }
});
