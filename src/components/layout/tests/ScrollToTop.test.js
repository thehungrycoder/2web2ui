import React from 'react';
import ScrollToTop from '../ScrollToTop';
import { shallow } from 'enzyme';

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders nothing', () => {
    const wrapper = shallow(<ScrollToTop/>);
    expect(wrapper.html()).toEqual(null);
  });

  it('scrolls to top once on mount', () => {
    shallow(<ScrollToTop/>);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });
});
