import { shallow } from 'enzyme';
import React from 'react';

import Tutorial from '../Tutorial';

describe('Component: Tutorial', () => {
  const props = {
    currentUser: {
      email_verified: true
    },
    hasSendingDomains: false,
    hasVerifiedDomains: true,
    hasApiKeysForSending: false,
    hasBounceDomains: true
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Tutorial {...props} />);
  });

  it('should show default email banner', () => {
    expect(wrapper).toMatchSnapshot();
  });

});
