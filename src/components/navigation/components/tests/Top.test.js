import React from 'react';
import { Top } from '../Top';
import context from 'src/__testHelpers__/context';

describe('Top', () => {
  let consumer;
  let props;

  beforeEach(() => {
    props = {
      openSupportPanel: jest.fn(),
      toggleMobileNav: jest.fn(),
      open: false
    };
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

  it('should call openSupportPanel when help icon is clicked', () => {
    consumer.children().find('HelpOutline').simulate('click');
    expect(props.openSupportPanel).toHaveBeenCalled();
  });
});
