import React from 'react';
import { mount } from 'enzyme';
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
      path: '/foo/bar'
    };

    wrapper = mount(<ProtectedRoute {...props} />);

  });

  it('should render component if logged in', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect to auth if you are not logged in', () => {

  });


});
