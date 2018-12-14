import React from 'react';
import { shallow } from 'enzyme';
import SubaccountOption from '../SubaccountOption';

describe('SubaccountOption', () => {
  const subject = (props = {}) => shallow(
    <SubaccountOption
      label="Test Option"
      value="Gotcha"
      {...props}
    />
  );

  it('renders option', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders selected option', () => {
    expect(subject({ selected: true })).toMatchSnapshot();
  });

  it('renders nested option', () => {
    expect(subject({ nested: true })).toMatchSnapshot();
  });

  it('calls onChange when option is clicked', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });

    wrapper.simulate('click');

    expect(onChange).toHaveBeenCalledWith('Gotcha');
  });

  it('does not call onChange when selected option is clicked', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange, selected: true });

    wrapper.simulate('click');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('calls onOpen when nested option is clicked', () => {
    const onOpen = jest.fn();
    const wrapper = subject({ onOpen, nested: true });

    wrapper.simulate('click');

    expect(onOpen).toHaveBeenCalled();
  });
});
