import React from 'react';
import { shallow } from 'enzyme';
import { EmailVerification } from '../EmailVerification';

describe('EmailVerification Component', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    const props = {
      history: { push: jest.fn() },
      showAlert: jest.fn(),
      verifyingEmail: true,
      error: null,
      token: 'my-token',
      verifyEmailToken: jest.fn()
    };

    wrapper = shallow(<EmailVerification {...props} />);
    instance = wrapper.instance();
  });

  it('should show loading component when verifying Email', () => {
    expect(wrapper).toMatchSnapshot();
    expect(instance.props.verifyEmailToken).toHaveBeenCalledWith({ token: 'my-token' });
    expect(instance.props.history.push).not.toHaveBeenCalled();
    expect(instance.props.showAlert).not.toHaveBeenCalled();
  });

  it('should render null when done loading', () => {
    wrapper.setProps({ verifyingEmail: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should go to dashboard and show error on failure', () => {
    wrapper.setProps({ error: new Error('no token') });
    expect(instance.props.history.push).toHaveBeenCalledWith('/dashboard');
    expect(instance.props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'The verification token is either invalid or expired.',
      details: 'no token'
    });
  });

  it('should go to dashboard and show success alert on verification', () => {
    wrapper.setProps({ verifyingEmail: false });
    expect(instance.props.history.push).toHaveBeenCalledWith('/dashboard');
    expect(instance.props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Your email address has been verified!'
    });

  });
});
