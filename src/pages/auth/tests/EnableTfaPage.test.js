import React from 'react';
import { shallow } from 'enzyme';
import { EnableTfaPage } from '../EnableTfaPage';
import RedirectAfterLogin from '../components/RedirectAfterLogin';

describe('Component: EnableTfaPage', () => {
  function subject(props) {
    const baseProps = {
      tfa: {
        token: 'token',
        username: 'username',
        refreshToken: 'refresh_token'
      },
      loggedIn: false,
      login: jest.fn()
    };
    return shallow(<EnableTfaPage {...baseProps} {...props} />);
  }

  it('should render correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('should redirect after login', () => {
    expect(subject({ loggedIn: true }).find(RedirectAfterLogin).exists()).toBeTruthy();
  });

  it('should login after enable', () => {
    const wrapper = subject();
    const instance = wrapper.instance();
    const props = instance.props;
    instance.afterEnable();
    expect(props.login).toHaveBeenCalledWith(expect.objectContaining({ authData: {
      username: props.tfa.username,
      access_token: props.tfa.token,
      refresh_token: props.tfa.refreshToken
    }}));
  });
});
