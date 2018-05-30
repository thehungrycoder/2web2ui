import React from 'react';
import { Navigation } from '../Navigation';
import context from 'src/__testHelpers__/context';

describe('Navigation', () => {
  let props;

  beforeEach(() => {
    props = {
      location: '/foo/bar',
      navItems: [
        { key: 'value' },
        { key: 'value2' },
        { key: 'value3' }
      ]
    };
  });

  it('should render on desktop', () => {
    const consumer = context(<Navigation {...props}/>, { mobile: false });
    expect(consumer.children()).toMatchSnapshot();
  });

  it('should render on mobile', () => {
    const consumer = context(<Navigation {...props}/>, { mobile: true });
    expect(consumer.children()).toMatchSnapshot();
  });

  it('should render on mobile and open', () => {
    const consumer = context(<Navigation {...props}/>, { mobile: true });
    consumer.component.instance().toggleMobileNav();
    expect(consumer.children().find('.Navigation').props().className).toMatchSnapshot();
  });

  it('should toggle menu when clicking overlay', () => {
    const consumer = context(<Navigation {...props}/>, { mobile: true });
    consumer.component.instance().toggleMobileNav();
    consumer.children().find('.Overlay').simulate('click');
    expect(consumer.children().find('.Navigation').props().className).toMatchSnapshot();
  });
});
