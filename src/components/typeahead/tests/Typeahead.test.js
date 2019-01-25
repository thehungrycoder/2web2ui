import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead, TypeaheadItem } from '../Typeahead';

jest.mock('lodash/debounce', () => jest.fn((fn) => {
  fn.cancel = jest.fn();
  return fn;
}));

describe('Typeahead', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      selectedItem: jest.fn(),
      results: [
        'apples',
        'bananas',
        'cauliflower'
      ]
    };

    wrapper = shallow(<Typeahead {...props} />);
  });

  it('calls onChange callback when changed', () => {
    const onChange = jest.fn();
    wrapper.setProps({ onChange });
    wrapper.simulate('change');
    expect(onChange).toHaveBeenCalled();
  });

  it('cancels debounced updates when unmounted', () => {
    const cancel = jest.spyOn(wrapper.instance().handleInputValueChange, 'cancel');
    wrapper.unmount();
    expect(cancel).toHaveBeenCalled();
  });

  it('sets matches when input value changes', () => {
    wrapper.simulate('inputValueChange', 'a');
    expect(wrapper).toHaveState('matches', ['apples']);
  });

  it('truncates matches to max number', () => {
    wrapper.setProps({
      maxNumberOfResults: 50,
      results: Array.from(Array(110)).map((_, index) => `example${index}`)
    });
    wrapper.simulate('inputValueChange', 'example');
    expect(wrapper.state('matches')).toHaveLength(50);
  });

  describe('render function', () => {
    let args;

    beforeEach(() => {
      args = {
        clearSelection: jest.fn(),
        inputValue: 'test@t',
        isOpen: false,
        highlightedIndex: 0,
        getInputProps: jest.fn((props) => props),
        getItemProps: jest.fn((a) => a)
      };
    });

    it('should render the list', () => {
      const result = shallow(wrapper.instance().typeaheadFn(args));
      expect(result).toMatchSnapshot();
    });

    it('should render the list with custom maxHeight', () => {
      wrapper.setProps({ maxHeight: 999 });
      const result = shallow(wrapper.instance().typeaheadFn(args));
      expect(result).toMatchSnapshot();
    });

    it('should switch placeholder if open', () => {
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, isOpen: true }));
      expect(result.find('TextField').props().placeholder).toEqual('Type to search');
    });

    it('should render the list with matches after input change', () => {
      wrapper.simulate('inputValueChange', 'a');
      const result = shallow(wrapper.instance().typeaheadFn(args));
      expect(result).toMatchSnapshot();
    });

    it('should render with selected item and not disabled', () => {
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: 'cauliflower' }));
      expect(result.find('TextField').props().connectRight).toMatchSnapshot(); // Clear button
      expect(result.find('TextField').props().readOnly).toBe(true); // Boolean prop
    });

    it('should not render clear button if disabled with selected item', () => {
      wrapper.setProps({ disabled: true });
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: 'cauliflower' }));
      expect(result.find('TextField').props().connectRight).toBe(null); // No clear button
    });

    it('should render error', () => {
      wrapper.setProps({ error: 'an error omg' });
      const result = shallow(wrapper.instance().typeaheadFn(args));
      expect(result.find('TextField').props().error).toBe('an error omg');
    });

    it('should not render error if it is open', () => {
      wrapper.setProps({ error: 'an error omg' });
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, isOpen: true }));
      expect(result.find('TextField').props().error).toBe(null);
    });

    it('should select first result when typeahead opens', () => {
      const ds = {
        setHighlightedIndex: jest.fn(),
        highlightedIndex: null
      };
      wrapper.instance().handleStateChange(null, ds);
      expect(ds.setHighlightedIndex).toHaveBeenCalledWith(0);
    });

    it('renders a typeahead item', () => {
      const wrapper = shallow(<TypeaheadItem id="example-id" label="Example Label" />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
