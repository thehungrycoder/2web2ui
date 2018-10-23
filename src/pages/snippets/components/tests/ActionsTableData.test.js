import React from 'react';
import { shallow } from 'enzyme';
import ActionsTableData from '../ActionsTableData';

describe('ActionsTableData', () => {
  it('renders actions popover', () => {
    const wrapper = shallow(<ActionsTableData id="example-id" name="Example Name" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders actions popover with subaccount specific edit link', () => {
    const wrapper = shallow(<ActionsTableData id="example-id" name="Example Name" subaccount_id={999} />);
    expect(wrapper).toMatchSnapshot();
  });
});