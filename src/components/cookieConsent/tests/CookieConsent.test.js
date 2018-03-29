import React from 'react';
import { shallow } from 'enzyme';
import { CookieConsent } from '../CookieConsent';

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

  it('should set the cookie if only the flag is set', () => {
    wrapper.setProps({ userFlagSet: true });
    expect(props.setConsentCookie).toHaveBeenCalled();
  });

  it('should not set the flag if already set', () => {
    wrapper.setProps({ userFlagset: true });
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });
});
