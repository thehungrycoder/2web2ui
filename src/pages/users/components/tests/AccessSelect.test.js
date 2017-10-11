import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import React from 'react';

import AccessSelect from '../AccessSelect';

const defaultProps = { value: 'admin' };
const tests = {
  'renders select': defaultProps,
  'renders access label when disabled': { ...defaultProps, disabled: true }
};

cases('AccessSelect', (props) => {
  const wrapper = shallow(<AccessSelect {...props} />);
  expect(wrapper).toMatchSnapshot();
}, tests);
