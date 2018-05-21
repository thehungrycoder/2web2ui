import { shallow } from 'enzyme';
import React from 'react';

import { AuthPage } from '../AuthPage';
import config from 'src/config';

describe('AuthPage tests', () => {
  const props = {
    auth: {},
    authenticate: jest.fn()
  };

  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<AuthPage {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when there is a login error', () => {
    wrapper.setProps({ auth: { errorDescription: 'uh oh!' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should show link to join when has_signup feature flag exists', () => {
    config.featureFlags = { has_signup: true };
    wrapper.setProps({});
    expect(wrapper).toMatchSnapshot();
  });

  it('should call authenticate with correct fields when submitting', () => {
    instance.loginSubmit({ username: 'foo', password: 'pw', rememberMe: true });
    expect(instance.props.authenticate).toHaveBeenCalledWith('foo', 'pw', true);
  });

});
