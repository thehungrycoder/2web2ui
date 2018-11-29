import { shallow } from 'enzyme';
import React from 'react';
import FacetFilter from '../FacetFilter';

describe('FacetFilter Component', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<FacetFilter {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
