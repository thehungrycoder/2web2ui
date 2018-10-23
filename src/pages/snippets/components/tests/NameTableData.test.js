import React from 'react';
import { shallow } from 'enzyme';
import NameTableData from '../NameTableData';

describe('NameTableData', () => {
  it('renders name data cell', () => {
    const wrapper = shallow(<NameTableData id="example-id" name="Example Name" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders name data cell with subaccount specific edit link', () => {
    const wrapper = shallow(<NameTableData id="example-id" name="Example Name" subaccount_id={999} />);
    expect(wrapper).toMatchSnapshot();
  });
});
