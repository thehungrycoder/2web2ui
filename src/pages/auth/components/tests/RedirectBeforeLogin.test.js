import React from 'react';
import { shallow } from 'enzyme';

import { RedirectBeforeLogin } from '../RedirectBeforeLogin';

describe('Component: RedirectBeforeLogin', () => {
  const pathname = '/path';

  function redirectChild(props) {
    return shallow(<RedirectBeforeLogin to={pathname} {...props} />)
      .find('Redirect')
      .first()
      .prop('to');
  }

  it('should redirect to the given route', () => {
    expect(redirectChild()).toHaveProperty('pathname', pathname);
  });

  it('should preserve router state', () => {
    const state = { redirectAfterLogin: '/semifredo' };
    expect(redirectChild({ location: { state }})).toHaveProperty('state', state);
  });

  it('should preserve query params', () => {
    const search = '?your-face';
    expect(redirectChild({ location: { search }})).toHaveProperty('search', search);
  });
});
