import { shallow } from 'enzyme';
import React from 'react';

import AceWrapper from './AceWrapper';

describe('AceWrapper', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      mode: 'html',
      syntaxValidation: false,
      input: {
        value: 'test',
        onBlur: jest.fn(),
        onFocus: jest.fn(),
        onChange: jest.fn()
      },
      readOnly: false,
      meta: {
        submitFailed: false,
        active: false,
        error: null
      }
    };

    wrapper = shallow(<AceWrapper {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set validation correctly', () => {
    wrapper.setProps({ syntaxValidation: true });
    expect(wrapper.find('ReactAce').props().setOptions.useWorker).toBe(true);
  });

  it('should handle events', () => {
    wrapper.find('ReactAce').simulate('change');
    expect(props.input.onChange).toHaveBeenCalled();

    wrapper.find('ReactAce').simulate('blur');
    expect(props.input.onBlur).toHaveBeenCalledWith('test');

    wrapper.find('ReactAce').simulate('focus');
    expect(props.input.onFocus).toHaveBeenCalledWith('test');
  });

  describe('error state', () => {
    it('should not show error without a submit attempt', () => {
      wrapper.setProps({ meta: { error: 'an error' }});
      expect(wrapper.find('Error').exists()).toBe(false);
    });

    it('should show error when submit fails', () => {
      wrapper.setProps({ meta: { error: 'an error', submitFailed: true }});
      expect(wrapper.find('Error').props().error).toBe('an error');
    });

    it('should not show error if the editor is active', () => {
      wrapper.setProps({ meta: { error: 'an error', submitFailed: true, active: true }});
      expect(wrapper.find('Error').exists()).toBe(false);
    });
  });
});
