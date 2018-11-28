import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead } from '../Typeahead';

describe('Component: Typeahead', () => {
  let props;
  let wrapper;
  let downshiftHelpers;

  beforeEach(() => {
    props = {
      items: [{ type: 'X', value: 'cross' }, { type: 'X', value: 'treasure' }, { type: 'Campaign', value: 'crossing' }],
      matches: [],
      onSelect: jest.fn(),
      refreshTypeaheadCache: jest.fn(() => Promise.resolve()),
      placeholder: '',
      lastPattern: null
    };

    downshiftHelpers = {
      getInputProps: jest.fn(),
      getItemProps: jest.fn(),
      isOpen: true,
      selectedItem: null,
      highlightedIndex: 0,
      clearSelection: jest.fn()
    };

    wrapper = shallow(<Typeahead {...props} />);
  });

  function renderTypeahead(wrapper, input) {
    const TypeaheadRender = wrapper.instance().onTypeahead;
    return shallow(<TypeaheadRender {...downshiftHelpers} inputValue = {input} {...props} />);
  }

  it('should render ok by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should trigger updateLookAhead functon on field change', async () => {
    expect(wrapper.state().calculatingMatches).toEqual(false);
    const { handleFieldChange, updateLookAheadDebounced } = wrapper.instance();
    await handleFieldChange({ target: { value: 'cros' }});
    updateLookAheadDebounced.flush(); // forces debounced calls to execute
    expect(props.refreshTypeaheadCache).toHaveBeenCalledTimes(1);
    expect(wrapper.state().calculatingMatches).toEqual(true);
    expect(wrapper.state().lastPattern).toEqual('cros');
  });

  it('should produce matches on search', () => {
    const pattern = 'cross';
    const result = wrapper.instance().getMatches({ pattern });
    expect(result).toEqual([{ type: 'X', value: 'cross' }, { type: 'Campaign', value: 'crossing' }]);
  });

  it('should produce whitelisted matches on search', () => {
    const pattern = 'cross';
    const result = wrapper.instance().getMatches({ pattern, whiteListTypes: ['Campaign']});
    expect(result).toEqual([{ type: 'Campaign', value: 'crossing' }]);
  });

  it('should produce blacklisted matches on search', () => {
    const pattern = 'cross';
    const result = wrapper.instance().getMatches({ pattern, blackListTypes: ['Campaign']});
    expect(result).toEqual([{ type: 'X', value: 'cross' }]);
  });

  it('should produce no matches on empty query', () => {
    const pattern = '';
    const result = wrapper.instance().getMatches({ pattern });
    expect(result).toEqual([]);
  });

  it('should first show synchronous matches', () => {
    wrapper.instance().updateLookAhead('cross');
    expect(renderTypeahead(wrapper, 'cross')).toMatchSnapshot();
  });

  it('should finally render with both synchronous and async matches', () => wrapper.instance().updateLookAhead('cross').then(() => {
    expect(renderTypeahead(wrapper, 'cross')).toMatchSnapshot();
  }));

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
