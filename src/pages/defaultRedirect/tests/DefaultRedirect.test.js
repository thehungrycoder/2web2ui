import React from 'react';
import { shallow } from 'enzyme';
import { DefaultRedirect } from '../DefaultRedirect';

jest.mock('src/config', () => ({
  splashPage: '/config/splash'
}));

describe('Component: DefaultRedirect', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      location: {
        state: {},
        search: '?test=one'
      },
      history: {
        push: jest.fn()
      },
      currentUser: {
        access_level: 'admin'
      },
      ready: false
    };
    props.history.push.mockName('historyPushMock');
    wrapper = shallow(<DefaultRedirect {...props} />);
    instance = wrapper.instance();
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect after login', () => {
    wrapper.setProps({ location: { state: { redirectAfterLogin: '/test/redirect/after/login' }}});
    props.history.push.mockClear();
    instance.handleRedirect();
    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith({
      pathname: '/test/redirect/after/login',
      state: { redirectAfterLogin: '/test/redirect/after/login' }
    }, { replace: true });
  });

  it('should do nothing if no redirect after login and not ready', () => {
    props.history.push.mockClear();
    instance.handleRedirect();
    expect(props.history.push).not.toHaveBeenCalled();
  });

  it('should redirect to summary report for reporting users', () => {
    wrapper.setProps({
      currentUser: {
        access_level: 'reporting'
      },
      ready: true
    });
    props.history.push.mockClear();
    instance.handleRedirect();
    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith({
      pathname: '/reports/summary',
      search: '?test=one',
      state: {}
    }, { replace: true });
  });

  it('should redirect based on config', () => {
    wrapper.setProps({ ready: true });
    props.history.push.mockClear();
    instance.handleRedirect();
    expect(props.history.push).toHaveBeenCalledTimes(1);
    expect(props.history.push).toHaveBeenCalledWith({
      pathname: '/config/splash',
      search: '?test=one',
      state: {}
    }, { replace: true });
  });

  it('should handle a redirect on mount', () => {
    jest.spyOn(instance, 'handleRedirect');
    instance.componentDidMount();
    expect(instance.handleRedirect).toHaveBeenCalledTimes(1);
  });

  it('should handle a redirect on update', () => {
    jest.spyOn(instance, 'handleRedirect');
    instance.componentDidUpdate();
    expect(instance.handleRedirect).toHaveBeenCalledTimes(1);
  });

});
