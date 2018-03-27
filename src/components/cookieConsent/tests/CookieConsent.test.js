import React from 'react';
import { shallow } from 'enzyme';
import { CookieConsent, ConsentBar } from '../CookieConsent';

describe('Component: CookieConsent', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      consentGiven: false,
      cookieSet: false,
      userFlagSet: false,
      accessControlReady: true,
      loggedIn: true,
      setConsentCookie: jest.fn(),
      userGivesCookieConsent: jest.fn()
    };

    wrapper = shallow(<CookieConsent {...props} />);
  });

  describe('ConsentBar', () => {
    it('should render correctly', () => {
      const props = { onDismiss: jest.fn() };
      expect(shallow(<ConsentBar {...props} />)).toMatchSnapshot();
    });
  });

  it('should render the banner without consent', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render the banner with consent', () => {
    wrapper.setProps({ consentGiven: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should give consent on dismissal', () => {
    wrapper.instance().storeConsent();
    expect(props.setConsentCookie).toHaveBeenCalledTimes(1);
    expect(props.userGivesCookieConsent).toHaveBeenCalledTimes(1);
  });

  it('should set the flag if only the cookie is set', () => {
    wrapper.setProps({ cookieSet: true });
    expect(props.userGivesCookieConsent).toHaveBeenCalled();
  });
});
