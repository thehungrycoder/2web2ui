import React from 'react';
import Top from '../Top';
import context from 'src/__testHelpers__/context';

describe('Top', () => {
  let consumer;
  const props = {
    toggleMobileNav: jest.fn(),
    open: false
  };

  beforeEach(() => {
    consumer = context(<Top {...props} />, { mobile: false });
  });

  it('should render correctly on desktop', () => {
    expect(consumer.children()).toMatchSnapshot();
  });

  it('should render correctly on mobile', () => {
    expect(consumer.children({ mobile: true })).toMatchSnapshot();
  });

  it('should toggle nav', () => {
    consumer.children({ mobile: true }).find('UnstyledLink').simulate('click');
    expect(props.toggleMobileNav).toHaveBeenCalled();
  });

  it('should render close icon when open', () => {
    consumer.component.setProps({ open: true });
    expect(consumer.children({ mobile: true })).toMatchSnapshot();
  });
});
