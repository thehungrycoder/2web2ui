import React from 'react';
import { shallow } from 'enzyme';
import { RadioGroup, SubaccountTypeaheadWrapper } from 'src/components';
import { Field } from 'redux-form';
import SubaccountSection from '../SubaccountSection';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';

describe('Templates SubaccountSection', () => {
  let wrapper;

  describe('on create', () => {
    it('should render radio group', () => {
      wrapper = shallow(<SubaccountSection assignTo='master' newTemplate />);

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(RadioGroup);
    });

    it('should render subaccount typeahead', () => {
      wrapper = shallow(<SubaccountSection assignTo='subaccount' newTemplate />);

      // Second Field rendered under RadioGroup
      const typeahead = wrapper.find(Field).at(1);
      expect(typeahead).toMatchSnapshot();
      expect(typeahead.props().component).toEqual(SubaccountTypeaheadWrapper);
    });

    it('should clear redux-form subaccount value when switching away from subaccount', () => {
      const props = {
        assignTo: 'subaccount',
        newTemplate: true,
        formName: 'templateCreate',
        change: jest.fn()
      };

      wrapper = shallow(<SubaccountSection {...props} />);
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

  describe('on edit', () => {
    it('should render a disabled subaccount field', () => {
      wrapper = shallow(<SubaccountSection subaccountId={101} />);

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(SubaccountTypeaheadWrapper);
    });

    it('should render toggle block if not assigned to subaccount', () => {
      wrapper = shallow(<SubaccountSection />);

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.find(Field).props().component).toEqual(ToggleBlock);
    });

    it('correctly parses toggle value into boolean', () => {
      wrapper = shallow(<SubaccountSection />);
      const parse = wrapper.find(Field).props().parse;
      expect(parse('')).toEqual(false);
      expect(parse(false)).toEqual(false);
      expect(parse('true')).toEqual(true);
      expect(parse(true)).toEqual(true);
    });
  });
});
