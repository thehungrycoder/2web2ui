import React from 'react';
import { shallow } from 'enzyme';
import { Typeahead, TypeaheadItem } from '../Typeahead';

jest.mock('lodash/debounce', () => jest.fn((fn) => {
  fn.cancel = jest.fn();
  return fn;
}));

describe('Typeahead', () => {
  const subject = (props = {}) => shallow(
    <Typeahead
      results={[
        'apples',
        'bananas',
        'cauliflower'
      ]}
      {...props}
    />
  );

  it('calls onChange callback when changed', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });
    wrapper.simulate('change');
    expect(onChange).toHaveBeenCalled();
  });

  it('cancels debounced updates when unmounted', () => {
    const wrapper = subject();
    const cancel = jest.spyOn(wrapper.instance().updateMatches, 'cancel');
    wrapper.unmount();
    expect(cancel).toHaveBeenCalled();
  });

  describe('render function', () => {
    const renderFn = (wrapper, props = {}) => {
      const Component = wrapper.prop('children');

      return shallow(
        <Component
          clearSelection={jest.fn()}
          inputValue="test@t"
          isOpen={false}
          highlightedIndex={0}
          getInputProps={jest.fn((props) => props)}
          getItemProps={jest.fn((a) => a)}
          {...props}
        />
      );
    };

    it('renders list of matches', () => {
      const functionWrapper = renderFn(subject());
      expect(functionWrapper).toMatchSnapshot();
    });

    it('updates list of matches when data is loaded', () => {
      const wrapper = subject({ results: []});
      wrapper.setProps({ results: ['one', 'two', 'three']});

      expect(
        renderFn(wrapper).find('ActionList').prop('actions')
      ).toEqual([
        expect.objectContaining({ item: 'one' }),
        expect.objectContaining({ item: 'two' }),
        expect.objectContaining({ item: 'three' })
      ]);
    });

    it('updates list of matches when input value change', () => {
      const wrapper = subject();
      wrapper.simulate('inputValueChange', 'a');

      expect(
        renderFn(wrapper).find('ActionList').prop('actions')
      ).toEqual([
        expect.objectContaining({ item: 'apples' })
      ]);
    });

    it('truncates list of matches to max number', () => {
      const wrapper = subject({
        maxNumberOfResults: 50,
        results: Array.from(Array(110)).map((_, index) => `example${index}`)
      });
      wrapper.simulate('inputValueChange', 'example');

      expect(renderFn(wrapper).find('ActionList').prop('actions')).toHaveLength(50);
    });

    it('renders list of matches with custom maxHeight', () => {
      const wrapper = subject({ maxHeight: 999 });
      expect(renderFn(wrapper).find('ActionList[maxHeight=999]')).toExist();
    });

    it('should switch placeholder if open', () => {
      const functionWrapper = renderFn(subject(), { isOpen: true });
      expect(functionWrapper.find('TextField')).toHaveProp('placeholder', 'Type to search');
    });

    it('should render with selected item and not disabled', () => {
      const functionWrapper = renderFn(subject(), { selectedItem: 'cauliflower' });
      expect(functionWrapper.find('TextField').prop('connectRight')).not.toBeNull();
      expect(functionWrapper.find('TextField')).toHaveProp('readOnly', true);
    });

    it('should not render clear button if disabled with selected item', () => {
      const wrapper = subject({ disabled: true });
      const functionWrapper = renderFn(wrapper, { selectedItem: 'cauliflower' });
      expect(functionWrapper.find('TextField')).toHaveProp('connectRight', null);
    });

    it('should render error', () => {
      const wrapper = subject({ error: 'an error omg' });
      const functionWrapper = renderFn(wrapper);
      expect(functionWrapper.find('TextField')).toHaveProp('error', 'an error omg');
    });

    it('should not render error if it is open', () => {
      const wrapper = subject({ error: 'an error omg' });
      const functionWrapper = renderFn(wrapper, { isOpen: true });
      expect(functionWrapper.find('TextField')).toHaveProp('error', null);
    });

    it('should select first result when typeahead opens', () => {
      const setHighlightedIndex = jest.fn();
      const wrapper = subject();
      wrapper.simulate('stateChange', null, { highlightedIndex: null, setHighlightedIndex });
      expect(setHighlightedIndex).toHaveBeenCalledWith(0);
    });

  });

  describe('TypeaheadItem', () => {
    it('renders a typeahead item', () => {
      const wrapper = shallow(<TypeaheadItem id="example-id" label="Example Label" />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
