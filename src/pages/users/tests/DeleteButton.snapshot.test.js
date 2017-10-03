import { shallow } from 'enzyme';
import fp from 'lodash/fp';
import React from 'react';

import DeleteButton from '../DeleteButton';

const defaultProps = {
  user: {},
};

const TestComponent = (props = {}) => {
  const nextProps = fp.merge(defaultProps, props);
  return shallow(<DeleteButton {...nextProps} />);
};

it('renders a button and hidden modal', () => {
  const wrapper = TestComponent();
  expect(wrapper).toMatchSnapshot();
});

it('renders nothing', () => {
  const wrapper = TestComponent({ disabled: true });
  expect(wrapper).toMatchSnapshot();
});
