import React from 'react';
import { shallow } from 'enzyme';
import { ProtectedRoute } from '../ProtectedRoute';

describe('Component: ProtectedRoute', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      auth: {
        loggedIn: true
      },
      condition: 'do shit',
      component: jest.fn(),
      path: '/foo/bar',
      location: {
        pathname: '/path',
        search: '',
        hash: ''
      }
    };

    wrapper = shallow(<ProtectedRoute {...props} />);
  });

  it('should render component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render route if logged in', () => {
    wrapper.instance().renderRoute();
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to auth if you are not logged in', () => {
    wrapper.setProps({
      auth: { loggedIn: false },
      location: {
        pathname: '/path',
        search: '?deep=true',
        hash: '#anchor'
      }
    });
    expect(wrapper.instance().renderRoute()).toMatchSnapshot();
  });
});
