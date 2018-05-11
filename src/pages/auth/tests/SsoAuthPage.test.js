import { shallow } from 'enzyme';
import React from 'react';

import { SsoAuthPage } from '../SsoAuthPage';

describe('SsoAuthPage tests', () => {
  const props = {
    auth: {},
    location: {},
    ssoCheck: jest.fn()
  };

  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<SsoAuthPage {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should throw error when ssoUser is false', () => {
    wrapper.setProps({ auth: { ssoUser: false }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should sso check on submit', () => {
    instance.loginSubmit({ username: 'foo' });
    expect(instance.props.ssoCheck).toHaveBeenCalledWith('foo');
  });

  it('should redirect to sso if there is a sso user', () => {
    const redirectSpy = jest.spyOn(window.location, 'assign').mockImplementation();
    wrapper.setProps({ auth: { ssoUser: true, username: 'foobar' }});
    expect(redirectSpy).toHaveBeenCalledWith(expect.stringMatching(/saml\/login\/foobar$/));
  });

  it('should display sso error message from url', () => {
    wrapper.setProps({ location: { search: `?error=${btoa('Oh no!')}` }});
    expect(wrapper).toMatchSnapshot();
  });
});
