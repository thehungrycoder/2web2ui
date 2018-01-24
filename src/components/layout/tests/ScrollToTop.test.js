import React from 'react';
import ScrollToTop from '../ScrollToTop';
import { shallow } from 'enzyme';

describe('ScrollToTop', () => {
  let scrollSpy;

  beforeEach(() => {
    scrollSpy = jest.spyOn(window, 'scrollTo');
  });

  afterEach(() => {
    scrollSpy.mockReset();
  });

  it('renders nothing', () => {
    const wrapper = shallow(<ScrollToTop/>);
    expect(wrapper.html()).toEqual(null);
  });

  it('scrolls to top once on mount', () => {
    shallow(<ScrollToTop/>);
    expect(scrollSpy).toHaveBeenCalledWith(0, 0);
    expect(scrollSpy).toHaveBeenCalledTimes(1);
  });
});
