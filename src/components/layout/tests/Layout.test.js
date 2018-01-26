import React from 'react';
import App from '../App';
import Form from '../Form';
import { Layout } from '../Layout';
import { shallow } from 'enzyme';

jest.mock('src/config/routes', () => [{ path: '/foo', layout: 'AppMock' }]);

describe('Layout App', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<App>App Layout</App>);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Layout Form', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Form>Form Layout</Form>);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Layout', () => {
  it('renders the correct default layout', () => {
    const location = { pathname: '/' };
    const wrapper = shallow(<Layout location={location}>Default</Layout>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders the specified layout', () => {
    const location = { pathname: '/foo' };
    const wrapper = shallow(<Layout location={location}>AppMock</Layout>);
    expect(wrapper).toMatchSnapshot();
  });
});
