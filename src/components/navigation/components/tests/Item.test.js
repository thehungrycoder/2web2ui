import React from 'react';
import { Item } from '../Item';
import context from 'src/__testHelpers__/context';

describe('Item tests', () => {
  const defaultContext = { mobile: false };

  it('should render a link correctly', () => {
    const item = context(
      <Item
        to='/to'
        icon='Mail'
        label='label'
        location={{ pathname: 'to' }}
      />
      , defaultContext);
    expect(item.children()).toMatchSnapshot();
  });

  it('should render a link with beta tag', () => {
    const item = context(
      <Item
        tag='beta'
        to='/to'
        icon='Mail'
        label='label'
        location={{ pathname: 'to' }}
      />
      , defaultContext);

    expect(item.children()).toMatchSnapshot();
  });

  it('should render a link with labs tag', () => {
    const item = context(
      <Item
        tag='labs'
        to='/to'
        icon='Mail'
        label='label'
        location={{ pathname: 'to' }}
      />
      , defaultContext);

    expect(item.children()).toMatchSnapshot();
  });

  it('should render a link with new tag', () => {
    const item = context(
      <Item
        tag='new'
        to='/to'
        icon='Mail'
        label='label'
        location={{ pathname: 'to' }}
      />
      , defaultContext);

    expect(item.children()).toMatchSnapshot();
  });

  it('should render children correctly', () => {
    const location = { pathname: 'to' };
    const children = [
      { to: '/child1', label: 'child 1', location },
      { to: '/child2', label: 'child 2', location }
    ];
    const item = context(
      <Item
        to='/to'
        icon='Mail'
        label='label'
        children={children}
        location={location}
      />
      , defaultContext);
    expect(item.children()).toMatchSnapshot();
  });

  it('should toggle open state when clicking link', () => {
    const location = { pathname: 'to' };
    const children = [
      { to: '/child1', label: 'child 1', location },
      { to: '/child2', label: 'child 2', location }
    ];

    const wrapper = context(<Item
      to='/to'
      icon='Mail'
      label='label'
      children={children}
      location={location}
    />, defaultContext);

    const setSpy = jest.spyOn(wrapper.component.instance(), 'setState');
    wrapper.children().find('a').simulate('click');
    expect(setSpy).toHaveBeenCalledWith({ open: true });
  });

  it('should set open state to true if location matches the route', () => {
    const location = { pathname: 'to' };
    const wrapper = context(<Item
      to='to'
      location={location}
    />, defaultContext);
    const stateSpy = jest.spyOn(wrapper.component.instance(), 'setState');
    wrapper.component.instance().componentDidMount();
    expect(stateSpy).toHaveBeenCalledWith({ open: true });
  });

  it('should set open state to false if location does not match route', () => {
    const location = { pathname: 'from' };
    const wrapper = context(<Item
      to='to'
      location={location}
    />, defaultContext);
    const stateSpy = jest.spyOn(wrapper.component.instance(), 'setState');
    wrapper.component.instance().componentDidMount();
    expect(stateSpy).not.toHaveBeenCalled();
  });

  it('should call toggle nav when on mobile', () => {
    const toggle = jest.fn();
    const item = context(
      <Item
        to='/to'
        icon='Mail'
        label='label'
        toggleMobileNav={toggle}
        location={{ pathname: 'to' }}
      />
      , { mobile: true });
    expect(item.children()).toMatchSnapshot();
    item.children().find('Link').simulate('click');
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
