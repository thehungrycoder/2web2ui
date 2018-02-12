import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import SubaccountTypeaheadWrapper from '../SubaccountTypeaheadWrapper';

cases('SubaccountTypeaheadWrapper', ({ name, ...props }) => { // ignore test name
  const wrapper = shallow(<SubaccountTypeaheadWrapper {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders subaccounts typeahead': {
    input: {
      name: 'example',
      onChange: jest.fn(),
      value: 'subaccount-one'
    },
    label: 'Start typing',
    meta: {},
    placeholder: 'example account',
    subaccounts: [
      { value: 'subaccount-one' },
      { value: 'subaccount-two' }
    ]
  },
  'renders subaccounts typeahead with error': {
    input: {
      name: 'example'
    },
    label: 'Start typing',
    meta: {
      active: false,
      error: 'Oh no!',
      touched: true
    },
    placeholder: 'example account',
    subaccounts: [
      { value: 'subaccount-one' },
      { value: 'subaccount-two' }
    ]
  }
});
