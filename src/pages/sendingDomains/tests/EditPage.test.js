import { shallow } from 'enzyme';
import React from 'react';

import { EditPage } from '../EditPage';

describe('Sending Domains Edit Page', () => {
  let wrapper;
  let props;

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

  const apiErrorResp = {
    response: {
      data: {
        errors: [ { message: 'Unhelpful cheese configuration' } ]
      }
    }
  };

  beforeEach(() => {
    props = {
      domain,
      getError: null,
      getLoading: false,
      getDomain: jest.fn(),
      deleteDomain: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn()
      },
      showAlert: jest.fn(),
      match: {
        params: { id: 'id' }
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

  it('should show a delete modal', () => {
    wrapper.instance().toggleDelete();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should delete a sending domain', async() => {
    await wrapper.instance().deleteDomain();
    expect(props.deleteDomain).toHaveBeenCalledTimes(1);
  });

  it('should show errors on delete', async() => {
    props.deleteDomain.mockImplementationOnce(() => Promise.reject(apiErrorResp));
    await wrapper.instance().deleteDomain();
    expect(props.showAlert).toHaveBeenCalledTimes(1);
  });

  it('should redirect after delete', async() => {
    await wrapper.instance().deleteDomain();
    expect(props.history.push).toHaveBeenCalledWith('/account/sending-domains');
  });
});
