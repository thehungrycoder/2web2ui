import React from 'react';
import { shallow } from 'enzyme';

import { RedirectAfterLogin } from '../RedirectAfterLogin';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

describe('LoginRedirect tests', () => {
  const baseProps = {
    history: { push: jest.fn() },
    location: { search: '?test=one' },
    auth: {}
  };

  function subject(props) {
    return shallow(<RedirectAfterLogin {...baseProps} {...props} />);
  }

  it('should not redirect when loggedIn is false', () => {
    expect(subject().instance().props.history.push).not.toHaveBeenCalled();
  });

  it('redirects to default route after mounted when logged in ', () => {
    const instance = subject({ auth: { loggedIn: true }}).instance();
    expect(instance.props.history.push).toHaveBeenCalledWith({
      pathname: DEFAULT_REDIRECT_ROUTE,
      search: '?test=one'
    });
  });

  it('redirects to default route when logged in', () => {
    const instance = subject({ auth: { loggedIn: true }}).instance();
    expect(instance.props.history.push).toHaveBeenCalledWith({
      pathname: DEFAULT_REDIRECT_ROUTE,
      search: '?test=one'
    });
  });

  it('redirects to desired route on mount when logged in', () => {
    const instance = subject({
      auth: { loggedIn: true },
      location: {
        state: {
          redirectAfterLogin: '/path'
        }
      }
    }).instance();

    expect(instance.props.history.push).toHaveBeenCalledTimes(1);
    expect(instance.props.history.push.mock.calls[0]).toMatchSnapshot();
  });

  it('redirects to desired route when logged in after mount', () => {
    const wrapper = subject({ location: {
      state: {
        redirectAfterLogin: '/path'
      }
    }});
    wrapper.setProps({ auth: { loggedIn: true }});
    const instance = wrapper.instance();
    expect(instance.props.history.push).toHaveBeenCalledTimes(1);
    expect(instance.props.history.push.mock.calls[0]).toMatchSnapshot();
  });

  it('should not redirect if props change to loggedIn false', () => {
    const instance = subject({
      auth: { loggedIn: false }
    }).instance();

    expect(instance.props.history.push).not.toHaveBeenCalled();
  });
});
