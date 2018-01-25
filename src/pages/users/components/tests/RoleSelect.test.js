import { shallow } from 'enzyme';
import React from 'react';
import { Select } from '@sparkpost/matchbox';
import RoleSelect from '../RoleSelect';

describe('Component: RoleSelect', () => {

  let props;
  let wrapper;

  beforeEach(() => {
    props = { value: 'admin' };
    wrapper = shallow(<RoleSelect {...props} />);
  });

  it('should render the select', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when disabled', () => {
    wrapper.setProps({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with default select options', () => {
    const options = wrapper.find(Select).props().options;
    expect(options.map((o) => o.value)).toEqual(['admin', 'reporting']);
  });

  it('should render with passed in select options', () => {
    wrapper.setProps({ selectOptions: [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b' }
    ]});
    const options = wrapper.find(Select).props().options;
    expect(options.map((o) => o.value)).toEqual(['a', 'b']);
  });

  it('should include superuser as a select option if specified in props', () => {
    wrapper.setProps({ allowSuperUser: true });
    const options = wrapper.find(Select).props().options;
    expect(options.map((o) => o.value)).toEqual(['admin', 'reporting', 'superuser']);
  });

  it('should call the onChange handler with the target of the event', () => {
    const target = {};
    const e = { target };
    const onChange = jest.fn();

    wrapper.setProps({ onChange });
    wrapper.find(Select).simulate('change', e);

    expect(onChange).toHaveBeenCalledWith(target);
  });

});
