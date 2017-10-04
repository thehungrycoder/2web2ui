import { shallow } from 'enzyme';
import fp from 'lodash/fp';
import React from 'react';

import AccessSelect from '../AccessSelect';

const defaultProps = {
  user: {
    access: 'admin'
  }
};

const TestComponent = (props = {}) => {
  const nextProps = fp.merge(defaultProps, props);
  return shallow(<AccessSelect {...nextProps} />);
};

it('renders select', () => {
  const wrapper = TestComponent();
  expect(wrapper).toMatchSnapshot();
});

it('renders access label when disabled', () => {
  const wrapper = TestComponent({ disabled: true });
  expect(wrapper).toMatchSnapshot();
});
