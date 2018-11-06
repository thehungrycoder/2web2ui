import React from 'react';
import { shallow } from 'enzyme';

import { SsoLoginForm } from '../SsoLoginForm';

function subject(props) {
  return shallow(<SsoLoginForm {...props} />);
}

it('should render', () => {
  expect(subject()).toMatchSnapshot();
});

it('should render during login', () => {
  expect(subject({ loginPending: true })).toMatchSnapshot();
});

it('calls onSubmit', () => {
  const handleSubmit = jest.fn();
  subject({ handleSubmit }).find('form').first().simulate('submit');
  expect(handleSubmit).toHaveBeenCalledTimes(1);
});
