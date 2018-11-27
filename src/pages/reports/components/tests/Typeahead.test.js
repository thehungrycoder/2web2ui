import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead } from '../Typeahead';
// import _ from 'lodash';

describe('Component: Typeahead', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      items: [{ type: 'X', value: 'cross' }, { type: 'X', value: 'treasure' }, { type: 'Campaign', value: 'crossing' }],
      matches: [],
      onSelect: jest.fn(),
      refreshTypeaheadCache: jest.fn(() => Promise.resolve()),
      placeholder: '',
      lastPattern: null
    };

    wrapper = shallow(<Typeahead {...props} />);
  });

  it('should render ok by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger updateLookAhead functon on field change', () => {
    expect(wrapper.state().calculatingMatches).toEqual(false);
    const { handleFieldChange, updateLookAheadDebounced } = wrapper.instance();
    handleFieldChange({ target: { value: 'cros' }});
    updateLookAheadDebounced.flush(); // forces debounced calls to execute
    expect(props.refreshTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(wrapper.state().calculatingMatches).toEqual(true);
    expect(wrapper.state().lastPattern).toEqual('cros');
  });

  it('should produce matches on search', () => {
    const value = 'cross';
    wrapper.instance().updateLookAhead(value).then(() => {
      expect(wrapper.state().calculatingMatches).toEqual(false);
      expect(wrapper.state()).toMatchSnapshot();
    });
  });

  it('should produce no matches on empty query', () => {
    const value = '';
    wrapper.instance().updateLookAhead(value).then(() => {
      expect(wrapper.state().calculatingMatches).toEqual(false);
      expect(wrapper.state()).toMatchSnapshot();
    });
  });

  it('should first show matches that do not use the metrics API calls', () => {
    const value = 'cross';
    props.refreshTypeaheadCache = jest.fn(() => Promise.reject());
    wrapper.instance().updateLookAhead(value);
    expect(wrapper.state()).toMatchSnapshot();
  });

  it('should render with matches', () => {
    const value = 'cros';
    const downshiftHelpers = {
      getInputProps: jest.fn(),
      getItemProps: jest.fn(),
      isOpen: true,
      inputValue: value,
      selectedItem: null,
      highlightedIndex: 0,
      clearSelection: jest.fn()
    };
    const TypeaheadRender = wrapper.instance().onTypeahead;
    wrapper.instance().updateLookAhead(value).then(() =>
      expect(shallow(<TypeaheadRender {...downshiftHelpers} {...props} />)).toMatchSnapshot());
  });

  it('should call onSelect on change', () => {
    const value = { type: 'Template', value: 'treasure' };
    wrapper.instance().handleDownshiftChange(value);
    expect(props.onSelect).toHaveBeenCalledWith(value);
  });

  it('should not call onSelect on clear', () => {
    wrapper.instance().handleDownshiftChange(null);
    expect(props.onSelect).not.toHaveBeenCalled();
  });
});
