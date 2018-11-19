import { shallow } from 'enzyme';
import React from 'react';
import { Typeahead, TypeaheadItem } from '../Typeahead';

const results = [
  'apples',
  'bananas',
  'cauliflower'
];

describe('Typeahead', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      onChange: jest.fn(),
      itemToString: jest.fn(),
      selectedItem: jest.fn(),
      results: []
    };

    wrapper = shallow(<Typeahead {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('render function', () => {
    let args;

    beforeEach(() => {
      wrapper.setProps({
        results
      });

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

    it('should switch placeholder if open', () => {
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, isOpen: true }));
      expect(result.find('TextField').props().placeholder).toEqual('Type to search');
    });

    it('should render with selected item and not disabled', () => {
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: results[2] }));
      expect(result.find('TextField').props().connectRight).toMatchSnapshot(); // Clear button
      expect(result.find('TextField').props().readOnly).toBe(true); // Boolean prop
    });

    it('should not render clear button if disabled with selected item', () => {
      wrapper.setProps({ disabled: true });
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: results[2] }));
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
