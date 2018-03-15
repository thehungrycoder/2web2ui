import { shallow } from 'enzyme';
import React from 'react';
import config from 'src/config';

import { RouteWatch } from '../RouteWatch';

const props = {
  location: {
    pathname: 'less.traveled'
  }
};

const gtag = jest.fn();
window.gtag = gtag;

let wrapper;

describe('RouteWatch', () => {

  beforeEach(() => {
    wrapper = shallow(<RouteWatch {...props} />);
  });

  test('renders Helmet with script', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('sets up gtag config on mount', () => {
    expect(window.gtag).toMatchSnapshot();
  });

  test('route change', () => {
    const pathname = 'yellow.brick';
    wrapper.setProps({ location: { pathname }});
    expect(gtag).toHaveBeenCalledTimes(2);
    expect(gtag).toHaveBeenCalledWith(
      'config',
      config.gaTag,
      { page_path: pathname }
    );
  });

  test('no change', () => {
    wrapper.setProps({ ...props });
    expect(gtag).toHaveBeenCalledTimes(1);
  });

  test('no config', () => {
    window.gtag = undefined;
    const pathname = 'yellow.brick';
    wrapper.setProps({ location: { pathname }});
    expect(gtag).toHaveBeenCalledTimes(1);
  });
});
