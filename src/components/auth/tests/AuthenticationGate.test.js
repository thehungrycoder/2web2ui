import React from 'react';
import { shallow } from 'enzyme';
import { AuthenticationGate } from '../AuthenticationGate';
import authCookie from 'src/helpers/authCookie';

jest.mock('src/helpers/authCookie');

describe('Component: AuthenticationGate', () => {
  let wrapper;
  let props;
  let cookie;

  beforeEach(() => {
    cookie = {
      username: 'appteam'
    };

    props = {
      auth: {
        token: null,
        loggedIn: false
      },
      login: jest.fn(),
      getGrantsFromCookie: jest.fn()

    };

    wrapper = shallow(<AuthenticationGate {...props} />);
    authCookie.get = jest.fn(() => cookie);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('componentWillMount', () => {
    it('logins and get grants if auth cookie exists', () => {
      wrapper.instance().componentWillMount();
      expect(authCookie.get).toHaveBeenCalledTimes(1);
      expect(props.login).toHaveBeenCalledTimes(1);
      expect(props.login).toHaveBeenCalledWith({ authData: cookie });
      expect(props.getGrantsFromCookie).toHaveBeenCalledTimes(1);
      expect(props.getGrantsFromCookie).toHaveBeenCalledWith(cookie);
    });

    it('does not login if when cookie not found', () => {
      authCookie.get.mockReturnValue(null);
      wrapper.instance().componentWillMount();
      expect(authCookie.get).toHaveBeenCalledTimes(1);
      expect(props.login).toHaveBeenCalledTimes(0);
      expect(props.getGrantsFromCookie).toHaveBeenCalledTimes(0);
    });

    it('does not login if already logged in', () => {
      wrapper.setProps({ auth: { token: 'foo', loggedIn: true }});

      wrapper.instance().componentWillMount();
      expect(authCookie.get).toHaveBeenCalledTimes(0);
      expect(props.login).toHaveBeenCalledTimes(0);
      expect(props.getGrantsFromCookie).toHaveBeenCalledTimes(0);
    });
  });
});
