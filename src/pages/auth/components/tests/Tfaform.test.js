import { shallow } from 'enzyme';
import React from 'react';

import { TfaForm } from '../TfaForm';

const props = {
  tfaPending: false,
  verifyAndLogin: jest.fn(() => Promise.resolve()),
  error: false,
  tfa: { enabled: false, name: 'me', test: 'this' }
};

let wrapper;
let instance;

beforeEach(() => {
  wrapper = shallow(<TfaForm {...props} />);
  instance = wrapper.instance();
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders correctly verifying tfa', () => {
  wrapper.setProps({ tfaPending: true });
  expect(wrapper).toMatchSnapshot();
});

it('calls correct method on submit', () => {
  wrapper.find('form').first().simulate('submit', { code: 'my-code' });
  expect(instance.props.verifyAndLogin).toHaveBeenCalledWith({ authData: { name: 'me', test: 'this' }, code: 'my-code' });
});

it('should verify tfa login on submit', () => {
  const verifySpy = jest.spyOn(instance.props, 'verifyAndLogin');
  instance.handleSubmit({ code: 'code' });
  expect(verifySpy).toHaveBeenCalled();
});

it('should throw a submission error when verifyAndLogin fails with 4xx error', () => {
  instance.props.verifyAndLogin.mockImplementation(() => Promise.reject({ response: { status: 400 }}));
  return instance.handleSubmit({ code: 'code' }).catch((err) => {
    expect(err.errors.code).toEqual('The code is invalid');
  });
});

it('should not throw an error when verifySpy fails with non 4xx error', async () => {
  instance.props.verifyAndLogin.mockImplementation(() => Promise.reject({ response: { status: 500 }}));
  await expect(instance.handleSubmit({ code: 'code' })).resolves.toBeUndefined();
});

it('should bind tfaSubmit to the submit handler of TfaForm', () => {
  const tfaForm = wrapper.find('form');
  expect(tfaForm.props().onSubmit).toBe(instance.handleSubmit);
});

