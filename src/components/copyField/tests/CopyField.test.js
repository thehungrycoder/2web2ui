import React from 'react';
import { shallow } from 'enzyme';
import CopyField from '../CopyField';

jest.mock('copy-to-clipboard');

describe('CopyField Component', () => {
  window.setTimeout = jest.fn();
  window.clearTimeout = jest.fn();

  it('should render - no props', () => {
    const wrapper = shallow(<CopyField />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().timeout).toEqual(null);
  });

  it('should not render button with hideCopy prop', () => {
    const wrapper = shallow(<CopyField hideCopy />);
    expect(wrapper.find('TextField').props().connectRight).toEqual(null);
  });

  it('should handle copy click', () => {
    const wrapper = shallow(<CopyField value='to copy' />);
    wrapper.instance().handleCopy();
    expect(wrapper).toHaveState('copied', true);
    expect(window.clearTimeout).toHaveBeenCalled();
    expect(wrapper.instance().timeout).not.toEqual(null);
  });

  it('should handle focus', () => {
    const wrapper = shallow(<CopyField value='to copy' />);
    const e = { target: { select: jest.fn() }};
    wrapper.instance().handleFieldFocus(e);
    expect(e.target.select).toHaveBeenCalled();
  });
});
