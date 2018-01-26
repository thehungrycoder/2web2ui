import { shallow } from 'enzyme';
import React from 'react';
import { SubaccountForm } from '../SubaccountForm';
import { Field } from 'redux-form';
import { RadioGroup, SubaccountTypeaheadWrapper } from 'src/components';

describe('Sending Domains Subaccount Form', () => {
  let wrapper;

  it('renders correctly', () => {
    wrapper = shallow(<SubaccountForm />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(Field).props().component).toEqual(RadioGroup);
  });

  it('renders typeahead if subaccount is selected', () => {
    wrapper = shallow(<SubaccountForm assignTo='subaccount' />);

    // Second Field rendered under RadioGroup
    const typeahead = wrapper.find(Field).at(1);
    expect(typeahead).toMatchSnapshot();
    expect(typeahead.props().component).toEqual(SubaccountTypeaheadWrapper);
  });

  it('should clear redux-form subaccount value when switching away from subaccount', () => {
    const props = {
      change: jest.fn(),
      assignTo: 'subaccount',
      formName: 'domainCreate'
    };

    wrapper = shallow(<SubaccountForm {...props} />);
    expect(props.change).not.toHaveBeenCalled();

    // Simulate redux-form field value change in cDU
    wrapper.setProps({ assignTo: 'master' });
    expect(props.change).toHaveBeenCalledWith(props.formName, 'subaccount', null);

    // cDU should not change redux-form value
    props.change.mockReset();
    wrapper.setProps({ assignTo: 'shared' });
    expect(props.change).not.toHaveBeenCalled();
  });
});
