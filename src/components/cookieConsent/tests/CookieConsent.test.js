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
      savingFlag: false,
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

  it('should attempt to give consent once only', () => {
    wrapper.setProps({ saveFailed: true });
    wrapper.instance().storeConsent();
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });

  it('should set the flag if only the cookie is set', () => {
    wrapper.setProps({ cookieSet: true });
    expect(props.userGivesCookieConsent).toHaveBeenCalled();
  });

  it('should set the cookie if only the flag is set', () => {
    wrapper.setProps({ userFlagSet: true });
    expect(props.setConsentCookie).toHaveBeenCalled();
  });

  it('should not set the flag unless logged in', () => {
    wrapper.setProps({ cookieSet: true, loggedIn: false });
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });

  it('should not set the flag unless access control is ready', () => {
    wrapper.setProps({ cookieSet: true, accessControlReady: false });
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });

  it('should not set the flag if already set', () => {
    wrapper.setProps({ userFlagSet: true });
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });

  it('should not set the flag if a call to set it is in flight', () => {
    wrapper.setProps({ savingFlag: true });
    expect(props.userGivesCookieConsent).not.toHaveBeenCalled();
  });
});
