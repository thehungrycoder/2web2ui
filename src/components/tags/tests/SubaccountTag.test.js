import React from 'react';
import { shallow } from 'enzyme';
import SubaccountTag from '../SubaccountTag';

describe('Component: SubaccountTag', () => {

  it('should render a non-default assigned subaccount', () => {
    expect(shallow(<SubaccountTag id={12} />)).toMatchSnapshot();
    expect(shallow(<SubaccountTag id='13' />)).toMatchSnapshot();
  });

  it('should render a default assigned subaccount', () => {
    expect(shallow(<SubaccountTag id={12} isDefault />)).toMatchSnapshot();
  });

  it('should render a shared with all tag', () => {
    expect(shallow(<SubaccountTag all />)).toMatchSnapshot();
  });

  it('should render a master account tag', () => {
    expect(shallow(<SubaccountTag master />)).toMatchSnapshot();
  });
});
