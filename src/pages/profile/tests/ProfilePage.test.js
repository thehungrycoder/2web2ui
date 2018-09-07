import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import { ProfilePage } from '../ProfilePage';
import { AccessControl } from 'src/components/auth';
import errorTracker from 'src/helpers/errorTracker';

jest.mock('src/helpers/errorTracker');

let props;
let wrapper;
let instance;

beforeEach(() => {
  props = {
    currentUser: {
      username: 'Lord Stark',
      email: 'ned.stark@winterfell.biz',
      customer: 12345,
      access_level: 'admin',
      is_sso: false
    },
    updateUser: jest.fn(() => Promise.resolve()),
    getCurrentUser: jest.fn(() => Promise.resolve()),
    confirmPassword: jest.fn(() => Promise.resolve())
  };

  wrapper = shallow(<ProfilePage {...props} />);
  instance = wrapper.instance();
});

describe('ProfilePage', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with verify email banner', () => {
    wrapper.setProps({ currentUser: { email_verified: false, verifyingEmail: true }});
    expect(wrapper).toMatchSnapshot();
  });

  cases('handles the is_sso condition on tfa form', ({ is_sso, result }) => {
    const condition = wrapper.find(AccessControl).at(1).prop('condition');
    expect(condition({ currentUser: { is_sso }, ready: true })).toEqual(result);
  }, {
    'is sso': { is_sso: true, result: false },
    'not sso': { is_sso: false, result: true }
  });

  cases('handles the is_sso condition on update password', ({ is_sso, result }) => {
    const condition = wrapper.find(AccessControl).at(2).prop('condition');
    expect(condition({ currentUser: { is_sso }, ready: true })).toEqual(result);
  }, {
    'is sso': { is_sso: true, result: false },
    'not sso': { is_sso: false, result: true }
  });

  cases('handles the various account types', ({ access_level, result }) => {
    const condition = wrapper.find(AccessControl).first().prop('condition');
    expect(condition({ currentUser: { access_level }, ready: true })).toEqual(result);
  }, {
    'user': { access_level: 'user', result: true },
    'heroku': { access_level: 'heroku', result: false },
    'azure': { access_level: 'azure', result: false }
  });

  describe('updateProfile', () => {
    it('should update profile correctly', async () => {
      await instance.updateProfile({ firstName: 'John', lastName: 'Doe' });
      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { first_name: 'John', last_name: 'Doe' });
      expect(props.getCurrentUser).toHaveBeenCalledTimes(1);
    });

    it('should ignore refetch error, but report error silently', async () => {
      const getCurrentUserError = new Error('wow');
      props.getCurrentUser.mockReturnValue(Promise.reject(getCurrentUserError));
      await instance.updateProfile({ firstName: 'Ryan', lastName: 'Seacrest' });

      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { first_name: 'Ryan', last_name: 'Seacrest' });
      expect(props.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(errorTracker.report).toHaveBeenCalledWith('silent-ignore-refetch-current-user', getCurrentUserError);
    });
  });

  describe('updatePassword', () => {
    it('updates password correctly', async () => {
      await instance.updatePassword({ currentPassword: '111', newPassword: '222' });
      expect(props.confirmPassword).toHaveBeenCalledWith('Lord Stark', '111');
      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { password: '222' });
    });
  });
});
