import { shallow } from 'enzyme';
import React from 'react';
import { SubaccountTypeahead } from '../SubaccountTypeahead';

const results = [
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
      results: []
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
    const noItem = wrapper.find('Typeahead').props().itemToString();
    const item = wrapper.find('Typeahead').props().itemToString({ id: 10101, name: 'tst' });
    expect(noItem).toEqual('');
    expect(item).toEqual('tst (10101)');
  });

  describe('render function', () => {
    let props;

    beforeEach(() => {
      props = {
        onChange: jest.fn(),
        getSubaccountsList: jest.fn(),
        hasSubaccounts: true,
        results: results
      };

      wrapper = shallow(<SubaccountTypeahead {...props} />);
    });

    it('should render the list', () => {
      const result = wrapper;
      expect(result).toMatchSnapshot();
    });
  });
});
