import React from 'react';
import WindowSize from '../WindowSize';
import { delay } from 'src/__testHelpers__';
import { shallow } from 'enzyme';

describe('WindowSize Provider', () => {
  let wrapper;

  beforeEach(() => {
    global.innerWidth = 500; // Jest defaults to 1024
    wrapper = shallow(<WindowSize>child</WindowSize>);
  });

  it('should render children and window event', () => {
    expect(wrapper.children()).toMatchSnapshot();
  });

  it('should update size on mount', () => {
    expect(wrapper).toHaveState({ mobile: true });
  });

  it('should update size on resize event', async () => {
    global.innerWidth = 2000;
    wrapper.find('WindowEvent').props().handler();
    await delay(400);
    expect(wrapper).toHaveState({ mobile: false });
  });
});
