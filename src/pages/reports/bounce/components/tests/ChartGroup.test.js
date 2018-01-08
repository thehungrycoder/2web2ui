import React from 'react';
import { ChartGroup } from '../ChartGroup';
import { shallow } from 'enzyme';

describe('ChartGroup: ', () => {

  const props = {
    categories: [{ name: 'cats', count: 1, children: [{ name: 'child' }]}],
    types: [{ name: 'types', count: 2, children: [{ name: 'child' }]}],
    aggregates: {
      countTargeted: 100,
      countBounce: 50
    }
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ChartGroup {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render label when hovering', () => {
    wrapper.instance().handleMouseOver({ name: 'cats', count: 2 });
    wrapper.update();
    expect(wrapper.find('ActiveLabel')).toMatchSnapshot();
  });

  it('should handle mouse out', () => {
    wrapper.instance().handleMouseOver({ name: 'cats', count: 2 });
    expect(wrapper.instance().state).toMatchSnapshot();
    wrapper.instance().handleMouseOut();
    expect(wrapper.instance().state).toMatchSnapshot();
  });

  it('should render correctly after click', () => {
    wrapper.instance().handleClick({ name: 'cats', count: 3, children: [{ name: 'child' }]});
    wrapper.update();
    expect(wrapper.find('PieChart.Legend')).toMatchSnapshot();
    expect(wrapper.find('PieChart.Chart')).toMatchSnapshot();
  });

  it('should handle breadcrumb', () => {
    wrapper.instance().handleClick({ name: 'cats', count: 3, children: [{ name: 'child' }]});
    expect(wrapper.instance().state).toMatchSnapshot();
    wrapper.instance().handleBreadcrumb();
    expect(wrapper.instance().state).toMatchSnapshot();
  });
});
