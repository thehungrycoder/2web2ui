import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import DeleteButton from '../DeleteButton';

const defaultProps = {
  user: {}
};

const TEST_CASES = {
  'renders a button': { ...defaultProps },
  'renders null': { disabled: true }
};

cases('DeleteButton', (props) => {
  const wrapper = shallow(<DeleteButton {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);
