import React from 'react';
import { shallow } from 'enzyme';
import ActionsTableData from '../ActionsTableData';

describe('ActionsTableData', () => {
  it('renders actions popover', () => {
    const wrapper = shallow(<ActionsTableData id="example-id" name="Example Name" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders actions popover with subaccount specific edit & delete links', () => {
    const wrapper = shallow(<ActionsTableData id="example-id" name="Example Name" subaccount_id={999} canCreate={true} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders actions popover without delete link', () => {
    const wrapper = shallow(<ActionsTableData id="example-id" name="Example Name" subaccount_id={999} canCreate={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
