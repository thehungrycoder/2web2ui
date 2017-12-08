import { shallow } from 'enzyme';
import React from 'react';

import FromEmailWrapper, { FromEmail } from '../FromEmail';

describe('From Email Typeahead Wrapper', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      input: {
        onChange: jest.fn()
      },
      meta: {},
      label: 'label'
    };

    wrapper = shallow(<FromEmailWrapper {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error', () => {
    wrapper.setProps({ meta: {
      active: false,
      touched: true,
      error: 'error message'
    }});
    expect(wrapper).toMatchSnapshot();
  });
});

describe('From Email Typeahead', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      domains: [
        { domain: 'test.com' },
        { domain: 'another.com' }
      ],
      onChange: jest.fn(),
      value: 'test@t'
    };

    wrapper = shallow(<FromEmail {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render list', () => {
    const args = {
      inputValue: 'test@t',
      isOpen: true,
      highlightedIndex: 0,
      getInputProps: jest.fn(),
      getItemProps: jest.fn((a) => a)
    };

    expect(wrapper).toHaveState('value', 'test@t');
    const result = wrapper.instance().typeaheadFn(args);
    expect(result).toMatchSnapshot();
  });

  it('should handle input value', () => {
    wrapper.instance().handleInputValueChange('new value');
    expect(wrapper).toHaveState('value', 'new value');
  });

  it('should handle state change', () => {
    const changes = {
      inputValue: 'new value'
    };
    const downshift = {
      highlightedIndex: null,
      setHighlightedIndex: jest.fn()
    };
    wrapper.instance().handleStateChange(changes, downshift);
    expect(wrapper.instance().props.onChange).toHaveBeenCalledWith('new value');
    expect(downshift.setHighlightedIndex).toHaveBeenCalledWith(0);
  });
});
