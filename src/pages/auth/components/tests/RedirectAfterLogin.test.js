import React from 'react';
import { shallow } from 'enzyme';

import { RedirectAfterLogin } from '../RedirectAfterLogin';
import { DEFAULT_REDIRECT_ROUTE } from 'src/constants';

describe('Component: RedirectAfterLogin', () => {
  const baseProps = {
    location: { search: '?test=one' }
  };

  function subject(props) {
    return shallow(<RedirectAfterLogin {...baseProps} {...props} />);
  }

  it('redirects to default route ', () => {
    expect(
      subject()
        .find('Redirect')
        .first()
        .prop('to')
    ).toEqual(
      expect.objectContaining({
        pathname: DEFAULT_REDIRECT_ROUTE,
        search: baseProps.location.search
      })
    );
  });
});
