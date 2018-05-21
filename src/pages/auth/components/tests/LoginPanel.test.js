import { shallow } from 'enzyme';
import React from 'react';

import { LoginPanel } from '../LoginPanel';

describe('LoginPanel tests', () => {
  const props = {
    ssoEnabled: true,
    title: 'panel tests',
    handleSubmit: jest.fn(),
    tfaEnabled: false,
    loginError: null
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<LoginPanel {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show tfa form when user has tfa enabled', () => {
    wrapper.setProps({ tfaEnabled: true });
    expect(wrapper).toMatchSnapshot();

  });

  it('should show error component when loginError exists', () => {
    wrapper.setProps({ loginError: 'failed to login' });
    expect(wrapper).toMatchSnapshot();

  });
});
