import React from 'react';
import { Layout } from '../Layout';
import Form from 'src/components/layout/Form';
import { shallow } from 'enzyme';
import * as findRouteByPath from 'src/helpers/findRouteByPath';

jest.mock('src/config/routes', () => ([]));
jest.mock('src/helpers/findRouteByPath');
jest.mock('src/components/layout/Form');

describe('Component: Layout', () => {

  let wrapper;
  let App;

  beforeEach(() => {
    App = (children) => children;
    Form.default = function DefaultLayout(children) { return children; };
    findRouteByPath.default = jest.fn(() => ({ layout: App, title: 'Foo' }));
    wrapper = shallow(<Layout location={{ pathname: '/test' }}><h1>My layout children</h1></Layout>);
  });

  it('should render a regular route with a specified layout and title', () => {
    expect(findRouteByPath.default).toHaveBeenCalledWith('/test');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a route that does not specify a layout', () => {
    findRouteByPath.default = jest.fn(() => ({ title: 'With a Default Layout' }));
    wrapper.setProps({ location: { pathname: '/default-layout' }});
    expect(findRouteByPath.default).toHaveBeenLastCalledWith('/default-layout');
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a route that does not specify a title', () => {
    findRouteByPath.default = jest.fn(() => ({ layout: App }));
    wrapper.setProps({ location: { pathname: '/no-title' }});
    expect(findRouteByPath.default).toHaveBeenLastCalledWith('/no-title');
    expect(wrapper).toMatchSnapshot();
  });
});
