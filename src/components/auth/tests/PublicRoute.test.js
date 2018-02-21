import React from 'react';
import { shallow } from 'enzyme';
import PublicRoute from '../PublicRoute';

describe('Component: PublicRoute', () => {
  let props;
  let wrapper;
  let route;

  beforeEach(() => {
    route = {
      path: '/join',
      public: true,
      component: jest.fn(),
      condition: jest.fn(() => true)
    };

    props = {
      ...route
    };

    wrapper = shallow(<PublicRoute {...props} />);
  });

  it('renders component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
