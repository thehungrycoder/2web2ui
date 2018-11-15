import { shallow } from 'enzyme';
import React from 'react';

import { SsoAuthPage } from '../SsoAuthPage';
import SsoLoginForm from '../components/SsoLoginForm';
import RedirectAfterLogin from '../components/RedirectAfterLogin';

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

  it('should redirect if already logged in', () => {
    const wrapper = subject({ auth: { loggedIn: true }});
    expect(wrapper.find(RedirectAfterLogin)).toHaveLength(1);
  });

  it('should throw error when ssoUser is false', () => {
    const wrapper = subject({ auth: { ssoUser: false }});
    wrapper.setState({ submitted: true });
    expect(wrapper.find(SsoLoginForm).first().prop('loginError')).toMatchSnapshot();
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
    const wrapper = subject({ location: { search: `?error=${btoa('Oh no!')}` }});
    expect(wrapper.find(SsoLoginForm).first().prop('loginError')).toMatchSnapshot();
  });

  it('should set submitting state on submit of loginSubmit', () => {
    const instance = subject().instance();
    expect(instance.state.submitted).toEqual(false);
    instance.loginSubmit({ username: 'foo' });
    expect(instance.state.submitted).toEqual(true);
  });
});
