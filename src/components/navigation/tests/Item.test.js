import React from 'react';
import Item from '../Item';
import { shallow } from 'enzyme';

describe('Item tests', () => {
  it('should render a link correctly', () => {
    const item = shallow(
      <Item
        to='/to'
        icon='Mail'
        label='label'
        location={ { pathname: 'to' } }
      />
    );
    expect(item).toMatchSnapshot();
  });

  it('should render children correctly', () => {
    const location = { pathname: 'to' };
    const children = [
      { to: '/child1', label: 'child 1', location },
      { to: '/child2', label: 'child 2', location }
    ];
    const item = shallow(
      <Item
        to='/to'
        icon='Mail'
        label='label'
        children={children}
        location={location}
      />
    );
    expect(item).toMatchSnapshot();
  });

  it('should toggle open state when clicking link', () => {
    const location = { pathname: 'to' };
    const children = [
      { to: '/child1', label: 'child 1', location },
      { to: '/child2', label: 'child 2', location }
    ];

    const wrapper = shallow(<Item
      to='/to'
      icon='Mail'
      label='label'
      children={children}
      location={location}
    />);

    const setSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.find('a').simulate('click');
    expect(setSpy).toHaveBeenCalledWith({ open: true });

  });

  it('should set open state to true if location matches the route', () => {
    const location = { pathname: 'to' };
    const wrapper = shallow(<Item
      to='to'
      location={location}
    />);
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.instance().componentWillMount();
    expect(stateSpy).toHaveBeenCalledWith({ open: true });

  });

  it('should set open state to false if location does not match route', () => {
    const location = { pathname: 'from' };
    const wrapper = shallow(<Item
      to='to'
      location={location}
    />);
    const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    wrapper.instance().componentWillMount();
    expect(stateSpy).not.toHaveBeenCalled();
  });
});
