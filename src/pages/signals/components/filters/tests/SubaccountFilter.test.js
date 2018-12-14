import React from 'react';
import { shallow } from 'enzyme';
import { SubaccountFilter } from '../SubaccountFilter';

describe('SubaccountFilter Component', () => {
  const subject = (props = {}) => shallow(
    <SubaccountFilter
      hasSubaccounts={true}
      {...props}
    />
  );

  const openPopover = (wrapper) => {
    wrapper.find('Button').simulate('click');
  };

  const openSearch = (wrapper) => {
    wrapper.find('SubaccountOption[nested=true]').simulate('open');
  };

  it('renders closed popover', () => {
    const wrapper = subject();
    expect(wrapper.find('Popover').prop('open')).toEqual(false);
  });

  it('renders nothing', () => {
    const wrapper = subject({ hasSubaccounts: false });
    expect(wrapper.html()).toBeNull();
  });

  it('renders open popover with options', () => {
    const wrapper = subject();
    openPopover(wrapper);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders open popover with subaccount search', () => {
    const wrapper = subject();

    openPopover(wrapper);
    openSearch(wrapper);

    expect(wrapper).toMatchSnapshot();
  });

  it('renders open popover with options after back button is clicked', () => {
    const wrapper = subject();

    openPopover(wrapper);
    openSearch(wrapper);

    wrapper.find('UnstyledLink').simulate('click');

    expect(wrapper).toMatchSnapshot();
  });

  it('calls changeSignalOptions when option is clicked', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });

    wrapper.setState({ isOpen: true });

    const optionWrapper = wrapper.find('SubaccountOption').first();
    const value = optionWrapper.prop('value');

    optionWrapper.simulate('change', value);

    expect(changeSignalOptions).toHaveBeenCalledWith({ subaccount: value });
  });

  it('calls changeSignalOptions when subaccount is selected', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });
    const value = {
      id: 123,
      name: 'Test Example'
    };

    wrapper.setState({ isOpen: true, isSearchOpen: true });
    wrapper.find('Connect(SubaccountTypeahead)').simulate('change', value);

    expect(changeSignalOptions).toHaveBeenCalledWith({ subaccount: value });
  });
});
