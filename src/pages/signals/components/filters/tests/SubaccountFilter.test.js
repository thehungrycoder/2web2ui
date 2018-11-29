import { shallow } from 'enzyme';
import React from 'react';
import SubaccountFilter from '../SubaccountFilter';

describe('SubaccountFilter Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<SubaccountFilter {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
