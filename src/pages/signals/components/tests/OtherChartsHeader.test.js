import { shallow } from 'enzyme';
import React from 'react';
import OtherChartsHeader from '../OtherChartsHeader';

describe('Signals OtherChartsHeader Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      facet: 'facet',
      facetId: 'Foo1'
    };
    wrapper = shallow(<OtherChartsHeader {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
