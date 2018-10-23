import React from 'react';
import { shallow } from 'enzyme';
import SubaccountTableData from '../SubaccountTableData';

describe('SubaccountTableData', () => {
  it('returns null', () => {
    const wrapper = shallow(<SubaccountTableData />);
    expect(wrapper.html()).toBeNull();
  });

  it('returns a tag', () => {
    const wrapper = shallow(<SubaccountTableData shared_with_subaccounts={false} subaccount_id={999} />);
    expect(wrapper).toMatchSnapshot();
  });
});
