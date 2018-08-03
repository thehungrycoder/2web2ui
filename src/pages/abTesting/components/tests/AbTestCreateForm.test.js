import React from 'react';
import { shallow } from 'enzyme';
import { AbTestCreateForm } from '../AbTestCreateForm';

describe('A/B Test Create Form Component', () => {
  let wrapper;
  const props = {
    handleSubmit: jest.fn(),
    change: jest.fn(),
    submitting: false,
    pristine: true,
    hasSubaccounts: false,
    templates: ['fake']
  };

  beforeEach(() => {
    wrapper = shallow(<AbTestCreateForm {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle submit', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('should render subaccount section if subaccounts exist', () => {
    wrapper.setProps({ hasSubaccounts: true, templates: ['fake']});
    expect(wrapper.find({ name: 'subaccount' })).toMatchSnapshot();
  });

  it('should not render subaccount section if subaccounts do not exist', () => {
    wrapper.setProps({ hasSubaccounts: false, templates: ['fake']});
    expect(wrapper.find({ name: 'subaccount' })).toHaveLength(0);
  });

  it('should handle ID fill', () => {
    wrapper.find('Field').at(0).simulate('change', { target: { value: 'test 1 2!' }});
    expect(wrapper.instance().props.change).toHaveBeenCalledWith('id', 'test-1-2');
  });

  describe('submit button props', () => {
    it('should render submit text', () => {
      expect(wrapper.find('Button').props().children).toEqual('Create New Test');
    });

    it('should render submitting text', () => {
      wrapper.setProps({ submitting: true, pristine: false });
      expect(wrapper.find('Button').props().children).toEqual('Submitting...');
    });
  });
});
