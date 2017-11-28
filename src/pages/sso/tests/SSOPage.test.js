import { shallow } from 'enzyme';
import React from 'react';

import { SSOPage } from '../SSOPage';

let props;

let wrapper;

beforeEach(() => {
  props = {
    login: jest.fn(),
    location: {
      search: '?ad=eyJhY2Nlc3NUb2tlbiI6MTIzLCJ1c2VybmFtZSI6InNhbWxfdGVzdCJ9' //{accessToken: 123, username: "saml_test"}
    },
    history: {
      push: jest.fn()
    }
  };

});

describe('SSOPage', () => {
  it('renders correctly', () => {
    wrapper = shallow(<SSOPage {...props} />);
    expect(wrapper).toMatchSnapshot();
  });


  it('calls login with correct data (saml)', () => {
    wrapper = shallow(<SSOPage {...props} />);
    expect(props.login).toHaveBeenCalledTimes(1);
    expect(props.login).toHaveBeenCalledWith({ access_token: 123, username: 'saml_test', refresh_token: '' }, true);
  });

  it('calls login with correct data (azure)', () => {
    props.location.search = '?token=eyJhY2Nlc3NUb2tlbiI6MTIzLCJ1c2VybmFtZSI6ImF6dXJlX3Rlc3QifQ=='; //{accessToken: 123, username: "azure_test"}
    wrapper = shallow(<SSOPage {...props} />);
    expect(props.login).toHaveBeenCalledTimes(1);
    expect(props.login).toHaveBeenCalledWith({ access_token: 123, username: 'azure_test', refresh_token: '' }, true);
  });

  it('redirects to dashboard after login', () => {
    wrapper = shallow(<SSOPage {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to auth after login fail (unknown payload)', () => {
    props.location.search = 'eyJmb28iOiJiYXIifQ=='; //btoa(JSON.stringify({foo: 'bar'}))
    wrapper = shallow(<SSOPage {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/auth');
  });

  it('redirects to auth after login fail (invalid data: error parsing)', () => {
    props.location.search = null;
    wrapper = shallow(<SSOPage {...props} />);
    expect(props.history.push).toHaveBeenCalledWith('/auth');
  });

});
