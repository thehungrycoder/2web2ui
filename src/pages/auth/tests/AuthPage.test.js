import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';
import config from 'src/config';

describe('AuthPage tests', () => {
  const baseProps = {
    loggedIn: false,
    tfaEnabled: false,
    authenticate: jest.fn()
  };

  function subject(props) {
    return shallow(<AuthPage {...baseProps} {...props} />);
  }

  it('renders correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  // move to LoginForm
  it('should show link to join when has_signup feature flag exists', () => {
    config.featureFlags = { has_signup: true };
    expect(subject()).toMatchSnapshot();
  });

  it('should call authenticate with correct fields when submitting', () => {
    const wrapper = subject();
    const instance = wrapper.instance();
    instance.loginSubmit({ username: 'foo', password: 'pw', rememberMe: true });
    expect(instance.props.authenticate).toHaveBeenCalledWith('foo', 'pw', true);
  });

  it('should redirect after login', () => {
    expect(subject({ loggedIn: true })).toMatchSnapshot();
  });

  it('should redirect to TFA iff enabled', () => {
    expect(subject({ tfaEnabled: true })).toMatchSnapshot();
  });
});
