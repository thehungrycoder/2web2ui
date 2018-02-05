import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup, SubaccountTypeaheadWrapper, TextFieldWrapper } from 'src/components';
import { Field } from 'redux-form';
import { SubaccountSection } from '../SubaccountSection';

describe('Webhooks SubaccountSection', () => {
  let wrapper;

  describe('on create', () => {
    it('should render radio group', () => {
      wrapper = shallow(<SubaccountSection assignTo='master' newWebhook />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(RadioGroup);
    });

    it('should render subaccount typeahead', () => {
      wrapper = shallow(<SubaccountSection assignTo='subaccount' newWebhook />);

      // Second Field rendered under RadioGroup
      const typeahead = wrapper.find(Field).at(1);
      expect(typeahead).toMatchSnapshot();
      expect(typeahead.props().component).toEqual(SubaccountTypeaheadWrapper);
    });

    it('should clear redux-form subaccount value when switching away from subaccount', () => {
      const props = {
        assignTo: 'subaccount',
        newWebhook: true,
        formName: 'webhook-create',
        change: jest.fn()
      };

      wrapper = shallow(<SubaccountSection {...props} />);
      expect(props.change).not.toHaveBeenCalled();

      // Simulate redux-form field value change in cDU
      wrapper.setProps({ assignTo: 'master' });
      expect(props.change).toHaveBeenCalledWith(props.formName, 'subaccount', null);

      // cDU should not change redux-form value
      props.change.mockReset();
      wrapper.setProps({ assignTo: 'all' });
      expect(props.change).not.toHaveBeenCalled();
    });
  });

  describe('on edit', () => {
    it('should render a disabled subaccount field', () => {
      wrapper = shallow(<SubaccountSection subaccount={{ name: 'sub name', id: 101 }} />);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(SubaccountTypeaheadWrapper);
    });

    it('should render toggle block if subaccount is a string', () => {
      wrapper = shallow(<SubaccountSection subaccount='Master and all subaccounts'/>);
      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(TextFieldWrapper);
    });
  });
});
