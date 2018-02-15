import React from 'react';
import { shallow } from 'enzyme';
import CopyCodes from '../CopyCodes';
import copy from 'copy-to-clipboard';

jest.mock('copy-to-clipboard');

describe('CopyCodes Component', () => {
  window.setTimeout = jest.fn();
  window.clearTimeout = jest.fn();
  let wrapper;
  const props = {
    codes: ['code1', 'code2']
  };

  beforeEach(() => {
    wrapper = shallow(<CopyCodes {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle copying to clipboard', () => {
    wrapper.instance().copyToClipboard();
    expect(wrapper).toHaveState('copied', true);
    expect(window.clearTimeout).toHaveBeenCalled();
    expect(wrapper.instance().timeout).not.toEqual(null);
    expect(copy).toHaveBeenCalledWith('code1\ncode2');
  });

  it('should show tooltip when copied state is true', () => {
    wrapper.setState({ copied: true });
    expect(wrapper).toMatchSnapshot();
  });
});
