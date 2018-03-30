import React from 'react';
import { shallow } from 'enzyme';

import JoinLink from '../JoinLink';

describe('JoinLink', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <JoinLink location={{ pathname: '/join', search: '?special=token' }} />
    );
  });

  it('should return EU sign-up link', () => {
    wrapper.setProps({ crossLinkTenant: 'spceu' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should return US sign-up link', () => {
    wrapper.setProps({ crossLinkTenant: 'spc' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should return no link otherwise', () => {
    wrapper.setProps({ crossLinkTenant: 'onterpreez' });
    expect(wrapper).toMatchSnapshot();
  });
});
