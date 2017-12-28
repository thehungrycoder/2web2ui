import { shallow } from 'enzyme';
import React from 'react';
import { PasswordForm } from '../PasswordForm';

describe('PasswordForm', () => {
  let wrapper;
  let instance;
  let props;
  beforeEach(() => {
    props = {
      currentPassword: 'abcd'
    };
    wrapper = shallow(<PasswordForm {...props} />);
    instance = wrapper.instance();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly when updating', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('disables button correctly', () => {
    wrapper.setProps({ currentPassword: 'foo', newPassword: 'foo' });
    expect(wrapper).toMatchSnapshot();
  });

  describe('validatePasswords', () => {
    it('validates passwords correctly', () => {
      expect(instance.validatePasswords('abcd')).toEqual('New Password is same as Current Password');
      expect(instance.validatePasswords('abcdd')).toEqual(undefined);
    });
  });
});

