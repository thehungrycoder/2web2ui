import React from 'react';
import { shallow } from 'enzyme';

import { LoginRedirect } from '../LoginRedirect';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

describe('LoginRedirect tests', () => {
  const props = {
    history: { push: jest.fn() },
    location: { search: '?test=one' },
    auth: {}
  };

  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(<LoginRedirect {...props} />);
    instance = wrapper.instance();
  });

  it('should not redirect when loggedIn is false', () => {
    expect(instance.props.history.push).not.toHaveBeenCalled();
  });

  it('redirects to default route after mounted when logged in ', () => {
    const wrapper = shallow(<LoginRedirect {...props} auth={{ loggedIn: true }} />);
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith({
      pathname: DEFAULT_REDIRECT_ROUTE,
      search: '?test=one'
    });
  });

  it('redirects to default route when logged in', () => {
    wrapper.setProps({ auth: { loggedIn: true }});
    expect(instance.props.history.push).toHaveBeenCalledWith({
      pathname: DEFAULT_REDIRECT_ROUTE,
      search: '?test=one'
    });
  });

  it('redirects to desired route when logged in', () => {
    wrapper.setProps({
      auth: { loggedIn: true },
      location: {
        state: {
          redirectAfterLogin: '/path'
        }
      }
    });

    expect(instance.props.history.push).toHaveBeenCalledWith('/path');
  });
});
