import { shallow } from 'enzyme';
import React from 'react';

import { EditPage } from '../EditPage';

describe('Sending Domains Edit Page', () => {
  let wrapper;

  const domain = {
    'is_default_bounce_domain': true,
    'dkim': {
      'headers': 'from:to:subject:date',
      'public': 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCH3n8S0ApNBowLfcKzQMK2KamxMC2TmMTVwwh9E0DQihCUxjieg9OdWwPP16osG95XoawSFCg114qTXX+UsPE40YpURpntKKa2XPLhEJYb5690yf7h0MmrqCkMTJbW23783gqZ/OUO6DGjTcNcvfWw4gn3t1jLyGl8Nk6EdAXVlQIDAQAB',
      'selector': 'scph0116'
    },
    'status': {
      'mx_status': 'valid',
      'spf_status': 'invalid',
      'cname_status': 'unverified',
      'ownership_verified': true,
      'abuse_at_status': 'unverified',
      'compliance_status': 'valid',
      'verification_mailbox_status': 'valid',
      'dkim_status': 'invalid',
      'postmaster_at_status': 'unverified'
    },
    'shared_with_subaccounts': false
  };

  beforeEach(() => {
    const props = {
      domain,
      getError: null,
      getLoading: false,
      getDomain: jest.fn(),
      match: {
        params: { id: 'abcd.com' }
      }
    };

    wrapper = shallow(<EditPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.getDomain).toHaveBeenCalledTimes(1);
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ getLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders error banner correctly', () => {
    wrapper.setProps({ getError: { message: 'error' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when props.domain is undefined', () => {
    wrapper.setProps({ domain: undefined });
    expect(wrapper).toMatchSnapshot();
  });
});
