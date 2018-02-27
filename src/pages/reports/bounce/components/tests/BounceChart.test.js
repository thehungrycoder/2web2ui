import React from 'react';
import BounceChart from '../BounceChart';
import { PieChart } from 'src/components';

import { shallow } from 'enzyme';

describe('Bounce Chart', () => {

  const props = {
    categories: [
      { name: 'hard', count: 5 },
      { name: 'soft', count: 1, children: [{ name: 'softchild1', count: 2 }, { name: 'softchild2', count: 3 }]}
    ],
    types: [
      { name: 'in', count: 20 },
      { name: 'out', count: 30 }
    ],
    aggregates: {
      countTargeted: 100,
      countBounce: 50
    }
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<BounceChart {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle mouse in and out', () => {
    wrapper.instance().handleMouseOver(props.types[0], 'secondary');
    wrapper.update();
    expect(wrapper.instance().state).toMatchSnapshot();
    expect(wrapper.find(PieChart.ActiveLabel)).toMatchSnapshot();

    wrapper.instance().handleMouseOut();
    wrapper.update();
    expect(wrapper.find(PieChart.ActiveLabel)).toMatchSnapshot();
    expect(wrapper.instance().state).toMatchSnapshot();
  });

  it('should render label when hovering over a child', () => {
    wrapper.instance().handleClick(props.categories[1]);
    wrapper.instance().handleMouseOver({ name: 'softchild1', count: 2 }, 'primary');
    wrapper.update();
    expect(wrapper.find(PieChart.ActiveLabel)).toMatchSnapshot();
  });

  it('should render correctly after click', () => {
    wrapper.instance().handleClick(props.categories[1]);
    wrapper.update();
    expect(wrapper.find(PieChart.Legend)).toMatchSnapshot();
    expect(wrapper.find(PieChart.Chart)).toMatchSnapshot();
  });

  it('should not do anything if clicking on an item without children', () => {
    wrapper.instance().handleClick(props.types[0]);
    expect(wrapper.instance().state).toMatchSnapshot();
  });

  it('should handle breadcrumb', () => {
    wrapper.instance().handleClick(props.categories[1]);
    expect(wrapper.instance().state).toMatchSnapshot();
    wrapper.instance().handleBreadcrumb();
    expect(wrapper.instance().state).toMatchSnapshot();
  });
});
