import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead } from '../Typeahead';

describe('Component: Typeahead', () => {
  let props;
  let wrapper;
  let downshiftHelpers;
  const defaultCrossMatches = [{ type: 'X', value: 'cross' }, { type: 'Campaign', value: 'crossing' }];

  const simulateMetricsAPICallChanges = (lastPattern) => {
    const newProps = {
      ...props,
      items: [{ type: 'Z', value: 'crossed' }]
    };
    wrapper = shallow(<Typeahead {...newProps} />);
    wrapper.setState({
      matches: defaultCrossMatches,
      lastPattern
    });
  };

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
    expect(result).toEqual(defaultCrossMatches);
  });

  it('should produce correct matches after excluding items', () => {
    const pattern = 'cross';
    const result = wrapper.instance().getMatches({ pattern, excludedItems: [{ type: 'X', value: 'cross' }]});
    expect(result).toEqual([{ type: 'Campaign', value: 'crossing' }]);
  });

  it('should produce no matches on empty query', () => {
    const pattern = '';
    const result = wrapper.instance().getMatches({ pattern });
    expect(result).toEqual([]);
  });

  it('should first show synchronous matches while waiting for async calls to finish', () => {
    const input = 'cross';
    wrapper.instance().updateLookAhead(input);
    expect(wrapper.state().calculatingMatches).toEqual(true);
    expect(renderTypeahead(wrapper, input)).toMatchSnapshot();
  });

  it('should not make any api requests nor have any matches with a pattern <2 characters', () => {
    const input = 'c';
    return wrapper.instance().updateLookAhead(input).then(() => {
      expect(props.refreshTypeaheadCache).not.toHaveBeenCalled();
      expect(renderTypeahead(wrapper, input)).toMatchSnapshot();
    });

  });

  it('should append new matches', () => {
    const input = 'cross';
    simulateMetricsAPICallChanges(input);
    wrapper.instance().appendNewMatches(input);
    expect(renderTypeahead(wrapper, input)).toMatchSnapshot();
  });

  it('should not append new matches if the pattern is not the most recent', () => {
    const input = 'cros';
    simulateMetricsAPICallChanges('cross');
    wrapper.instance().appendNewMatches(input);
    expect(wrapper.state('matches')).toEqual(defaultCrossMatches);
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
