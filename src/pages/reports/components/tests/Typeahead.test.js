import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead } from '../Typeahead';
// import _ from 'lodash';

describe('Component: Typeahead', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      items: [{ type: 'X', value: 'cross' }, { type: 'X', value: 'treasure' }],
      matches: [],
      onSelect: jest.fn(),
      refreshTypeaheadCache: jest.fn(),
      placeholder: ''
    };

    wrapper = shallow(<Typeahead {...props} />);
  });

  it('should render ok by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should update matches on field change', () => {
    const { handleFieldChange, updateMatchesDebounced } = wrapper.instance();
    handleFieldChange({ target: { value: 'cros' }});
    updateMatchesDebounced.flush(); // forces debounced calls to execute
    expect(wrapper.state()).toMatchSnapshot();
  });

  it('should produce matches on search', () => {
    const value = 'cross';
    wrapper.instance().updateMatches(value);
    expect(wrapper.state()).toMatchSnapshot();
  });

  it('should produce no matches on empty query', () => {
    const value = '';
    wrapper.instance().updateMatches(value);
    expect(wrapper.state()).toMatchSnapshot();
  });

  it('should render with matches', () => {
    const value = 'cross';
    const downshiftHelpers = {
      getInputProps: jest.fn(),
      getItemProps: jest.fn(),
      isOpen: true,
      inputValue: value,
      selectedItem: null,
      highlightedIndex: 0,
      clearSelection: jest.fn()
    };

    wrapper.instance().updateMatches(value);
    const TypeaheadRender = wrapper.instance().onTypeahead;
    expect(shallow(<TypeaheadRender {...downshiftHelpers} {...props} />)).toMatchSnapshot();
  });

  it('should call onSelect on change', () => {
    const value = { type: 'X', value: 'treasure' };
    wrapper.instance().handleDownshiftChange(value);
    expect(props.onSelect).toHaveBeenCalledWith(value);
  });

  it('should not call onSelect on clear', () => {
    wrapper.instance().handleDownshiftChange(null);
    expect(props.onSelect).not.toHaveBeenCalled();
  });
});
