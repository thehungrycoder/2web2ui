import { shallow } from 'enzyme';
import React from 'react';
import { CreateForm } from '../CreateForm';
import SubaccountForm from '../SubaccountForm';

describe('Sending Domains Create Form', () => {
  let wrapper;

  const props = {
    submitting: false,
    handleSubmit: jest.fn(),
    hasSubaccounts: false
  };

  beforeEach(() => {
    wrapper = shallow(<CreateForm {...props} />);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(SubaccountForm)).toHaveLength(0);
  });

  it('renders subaccount section if account has subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find(SubaccountForm)).toHaveLength(1);
  });

  it('submits correctly', () => {
    wrapper.find('form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('renders submitting state correctly', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });
});
