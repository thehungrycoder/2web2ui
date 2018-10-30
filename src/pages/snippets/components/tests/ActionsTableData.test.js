import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import ActionsTableData from '../ActionsTableData';

cases('ActionsTableData', ({ name, ...props }) => {
  const wrapper = shallow(
    <ActionsTableData id="example-id" name="Example Name" {...props} />
  );

  expect(wrapper).toMatchSnapshot();
}, {
  'by default': {},
  'with subaccount': {
    subaccount_id: 999
  },
  'with access to create': {
    canCreate: true
  }
});
