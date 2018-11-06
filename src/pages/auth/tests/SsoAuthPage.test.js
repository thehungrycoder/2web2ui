import { shallow } from 'enzyme';
import React from 'react';

import { SsoAuthPage } from '../SsoAuthPage';

describe('SsoAuthPage tests', () => {
  const baseProps = {
    auth: {},
    location: {},
    ssoCheck: jest.fn()
  };

  function subject(props) {
    return shallow(<SsoAuthPage {...baseProps} {...props} />);
  }

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('should throw error when ssoUser is false', () => {
    const wrapper = subject({ auth: { ssoUser: false }});
    wrapper.setState({ submitted: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should sso check on submit', () => {
    const instance = subject().instance();
    instance.loginSubmit({ username: 'foo' });
    expect(instance.props.ssoCheck).toHaveBeenCalledWith('foo');
  });

  it('should redirect to sso if there is a sso user', () => {
    const redirectSpy = jest.spyOn(window.location, 'assign').mockImplementation();
    const wrapper = subject();
    wrapper.setProps({ auth: { ssoUser: true, username: 'foobar' }});
    expect(redirectSpy).toHaveBeenCalledWith(expect.stringMatching(/saml\/login\/foobar$/));
  });

  it('should display sso error message from url', () => {
    expect(subject({ location: { search: `?error=${btoa('Oh no!')}` }})).toMatchSnapshot();
  });

  it('should set submitting state on submit of loginSubmit', () => {
    const instance = subject().instance();
    expect(instance.state.submitted).toEqual(false);
    instance.loginSubmit({ username: 'foo' });
    expect(instance.state.submitted).toEqual(true);
  });
});
