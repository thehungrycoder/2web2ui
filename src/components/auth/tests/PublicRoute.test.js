import React from 'react';
import { shallow } from 'enzyme';
import { PublicRoute } from '../PublicRoute';

describe('Component: PublicRoute', () => {
  let props;
  let wrapper;
  let route;
  const TestComponent = () => <div>Test Component</div>;

  beforeEach(() => {
    route = {
      path: '/join',
      public: true,
      component: TestComponent,
      condition: jest.fn(() => true)
    };

    props = {
      forceLogout: true,
      loggedIn: true,
      logout: jest.fn(),
      ...route
    };

    wrapper = shallow(<PublicRoute {...props} />);
  });

  describe('with force logout on', () => {
    it('calls logout on mount and renders null', () => {
      expect(props.logout).toHaveBeenCalledTimes(1);
      expect(wrapper.html()).toBe(null);
    });
  });

  it('renders component', () => {
    wrapper.setProps({ forceLogout: false, loggedIn: false });
    expect(wrapper.props().render()).toMatchSnapshot();
  });
});
