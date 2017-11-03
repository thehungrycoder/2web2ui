import React from 'react';
import LegendItem from '../LegendItem';
import { shallow } from 'enzyme';

describe('LegendItem: ', () => {

  const props = {
    name: 'name',
    count: 2,
    fill: '#000',
    children: ['children'],
    breadcrumb: false,
    onClick: jest.fn(),
    handleClick: jest.fn()
  }

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LegendItem {...props} />)
  })

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render breadcrumb', () => {
    wrapper.setProps({ breadcrumb: true })
    expect(wrapper).toMatchSnapshot();
  });
});
