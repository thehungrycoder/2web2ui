import React from 'react';
import {
  TextFieldWrapper,
  SelectWrapper,
  CheckboxWrapper,
  RadioGroup,
  SubaccountTypeaheadWrapper,
  PoolTypeaheadWrapper
} from '../reduxFormWrappers';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

describe('Redux-form field wrappers', () => {
  const sharedProps = {
    input: {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: 'field-value',
      name: 'field-name'
    },
    meta: {
      error: 'error message',
      active: false,
      touched: false
    },
    pass: 'through-prop'
  };

  describe('TextFieldWrapper', () => {
    const propCases = [
      sharedProps, // default case
      { ...sharedProps, meta: { ...sharedProps.meta, touched: true }} // error case
    ];

    cases('Render:', (opts) => {
      const wrapper = shallow(<TextFieldWrapper {...opts} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });

  describe('SelectWrapper', () => {
    const options = [1, 2, 3];
    const propCases = [
      { ...sharedProps, options }, // default case
      { ...sharedProps, options, meta: { ...sharedProps.meta, touched: true }} // error case
    ];

    cases('Render:', (opts) => {
      const wrapper = shallow(<SelectWrapper {...opts} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });

  describe('CheckboxWrapper', () => {
    const propCases = [
      { ...sharedProps, input: { ...sharedProps.input, value: true }}, // default case
      { ...sharedProps, input: { ...sharedProps.input, value: false }, meta: { ...sharedProps.meta, touched: true }} // error case
    ];

    cases('Render:', (opts) => {
      const wrapper = shallow(<CheckboxWrapper {...opts} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });

  describe('RadioGroup', () => {
    const props = {
      ...sharedProps,
      input: { ...sharedProps, value: 'one' },
      title: 'Radio Group',
      options: [{ label: '1', value: 'one' }, { label: '2', value: 'two', disabled: true }, { label: '1', value: 'three' }]
    };

    it('should render', () => {
      const wrapper = shallow(<RadioGroup {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('SubaccountTypeaheadWrapper', () => {
    const subaccount = {
      subaccount_id: 101,
      name: 'sub 101'
    };

    const propCases = [
      { ...sharedProps, input: { ...sharedProps.input, value: subaccount }}, // default case
      { ...sharedProps, input: { ...sharedProps.input, value: subaccount }, meta: { ...sharedProps.meta, touched: true }} // error case
    ];

    cases('Render:', (opts) => {
      const wrapper = shallow(<SubaccountTypeaheadWrapper {...opts} />);
      expect(wrapper).toMatchSnapshot();
    }, propCases);
  });

  describe('PoolTypeaheadWrapper', () => {
    const props = {
      ...sharedProps,
      input: { ...sharedProps, value: { pool: 'selected pool' }},
      pools: ['pool 1', 'pool 2']
    };

    it('should render', () => {
      const wrapper = shallow(<PoolTypeaheadWrapper {...props} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

});
