import { shallow } from 'enzyme';
import React from 'react';
import DateFilter from '../DateFilter';

describe('DateFilter Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<DateFilter {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
