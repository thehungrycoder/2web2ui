import React from 'react';
import { shallow } from 'enzyme';
import CopyField from '../CopyField';

jest.mock('copy-to-clipboard');

describe('CopyField Component', () => {
  window.setTimeout = jest.fn();
  window.clearTimeout = jest.fn();
  let wrapper;
  const props = {
    hideCopy: false
  };

  beforeEach(() => {
    wrapper = shallow(<CopyField {...props} />);
  });

  it('should render - no props', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().timeout).toEqual(null);
  });

  it('should not render button with hideCopy prop', () => {
    wrapper.setProps({ hideCopy: true });
    expect(wrapper.find('TextField').props().connectRight).toEqual(null);
  });

  it('should handle copy click', () => {
    wrapper.setProps({ value: 'to copy' });
    wrapper.instance().handleCopy();
    wrapper.update();
    expect(wrapper).toHaveState('copied', true);
    expect(wrapper.find('TextField').props().connectRight).toMatchSnapshot();
    expect(window.clearTimeout).toHaveBeenCalled();
    expect(wrapper.instance().timeout).not.toEqual(null);
  });

  it('should handle focus', () => {
    wrapper.setProps({ value: 'to copy' });
    const e = { target: { select: jest.fn() }};
    wrapper.instance().handleFieldFocus(e);
    expect(e.target.select).toHaveBeenCalled();
  });

  it('should pass rest of attrs to TextField', () => {
    wrapper.setProps({ required: true, multiline: true });
    expect(wrapper).toMatchSnapshot();
  });
});
