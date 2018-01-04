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
    jest.clearAllMocks();
    wrapper = shallow(<RouteWatch {...props} />);
  });

  test('renders null', () => {
    expect(wrapper).toMatchSnapshot();
  });

  test('route change', () => {
    const pathname = 'yellow.brick';
    wrapper.setProps({ location: { pathname }});
    expect(gtag).toHaveBeenCalledWith(
      'config',
      config.gaTag,
      { page_path: pathname }
    );
  });

  test('no change', () => {
    wrapper.setProps({ ...props });
    expect(gtag).not.toHaveBeenCalled();
  });

  test('no config', () => {
    window.gtag = undefined;
    const pathname = 'yellow.brick';
    wrapper.setProps({ location: { pathname }});
    expect(gtag).not.toHaveBeenCalled();
  });
});
