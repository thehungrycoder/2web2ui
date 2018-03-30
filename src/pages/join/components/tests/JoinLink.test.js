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
    wrapper.setProps({ tenant: 'spc' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should return US sign-up link', () => {
    wrapper.setProps({ tenant: 'spceu' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should return no link otherwise', () => {
    wrapper.setProps({ tenant: 'onterpreez' });
    expect(wrapper).toMatchSnapshot();
  });
});
