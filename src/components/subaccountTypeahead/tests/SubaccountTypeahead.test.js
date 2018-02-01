import { shallow } from 'enzyme';
import React from 'react';
import { SubaccountTypeahead } from '../SubaccountTypeahead';

const subaccounts = [
  { id: 1, name: 'Subaccount 1' },
  { id: 2, name: 'Subaccount 2' },
  { id: 3, name: 'Subaccount 3' },
  { id: 4, name: 'Subaccount 4' },
  { id: 5, name: 'Subaccount 5' },
  { id: 6, name: 'Subaccount 6' }
];

describe('Subaccount Typeahead', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      onChange: jest.fn(),
      getSubaccountsList: jest.fn(),
      subaccounts: []
    };

    wrapper = shallow(<SubaccountTypeahead {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render nothing if account has no subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: false });
    expect(wrapper.html()).toEqual(null);
  });

  it('should get subaccounts if no subaccounts exist', () => {
    wrapper.setProps({ hasSubaccounts: true });
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.getSubaccountsList).toHaveBeenCalled();
  });

  it('should not get subaccounts if subaccounts exist', () => {
    wrapper.setProps({ hasSubaccounts: false });
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.getSubaccountsList).not.toHaveBeenCalled();
  });

  it('should render itemToString correctly', () => {
    wrapper.setProps({ hasSubaccounts: true });
    const noItem = wrapper.find('Downshift').props().itemToString();
    const item = wrapper.find('Downshift').props().itemToString({ id: 10101, name: 'tst' });
    expect(noItem).toEqual('');
    expect(item).toEqual('tst (10101)');
  });

  describe('render function', () => {
    let args;

    beforeEach(() => {
      wrapper.setProps({
        subaccounts,
        disabled: false,
        helpText: 'help text',
        name: 'redux form name'
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
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: subaccounts[2] }));
      expect(result.find('TextField').props().connectRight).toMatchSnapshot(); // Clear button
      expect(result.find('TextField').props().readOnly).toBe(true); // Boolean prop
    });

    it('should not render clear button if disabled with selected item', () => {
      wrapper.setProps({ disabled: true });
      const result = shallow(wrapper.instance().typeaheadFn({ ...args, selectedItem: subaccounts[2] }));
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
  });
});
