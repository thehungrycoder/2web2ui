import { shallow } from 'enzyme';
import React from 'react';
import SpamTrapActions from '../SpamTrapActions';

describe('Signals spam trap actions component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = { percent: null };
    wrapper = shallow(<SpamTrapActions {...props}/>);
  });

  it('renders when empty', () => {
    expect(wrapper.find('Actions').prop('empty')).toBe(true);
  });

  it('renders good message', () => {
    wrapper.setProps({ percent: 0.0004 });
    expect(wrapper.find('Actions')).toMatchSnapshot();
  });

  it('renders warning message', () => {
    wrapper.setProps({ percent: 0.0006 });
    expect(wrapper.find('Actions')).toMatchSnapshot();
  });

  it('renders bad message', () => {
    wrapper.setProps({ percent: 0.009 });
    expect(wrapper.find('Actions')).toMatchSnapshot();
  });

  it('renders atrocious message', () => {
    wrapper.setProps({ percent: 0.02 });
    expect(wrapper.find('Actions')).toMatchSnapshot();
  });
});
