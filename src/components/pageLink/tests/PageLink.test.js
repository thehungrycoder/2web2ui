import React from 'react';
import { shallow } from 'enzyme';
import PageLink from '../PageLink';

describe('PageLink', () => {
  it('should render a page link', () => {
    const wrapper = shallow(<PageLink to="/profile">My Profile</PageLink>);
    expect(wrapper).toMatchSnapshot();
  });
});
