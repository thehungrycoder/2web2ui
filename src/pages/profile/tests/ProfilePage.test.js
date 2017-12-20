import { shallow } from 'enzyme';
import React from 'react';

import { ProfilePage } from '../ProfilePage';

let props;
let wrapper;
let instance;

beforeEach(() => {
  props = {
    currentUser: {
      username: 'Lord Stark',
      email: 'ned.stark@winterfell.biz',
      customer: 12345
    },
    updateUser: jest.fn(() => Promise.resolve()),
    updateCurrentUser: jest.fn(() => Promise.resolve()),
    confirmPassword: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn()
  };

  jest.clearAllMocks();
  wrapper = shallow(<ProfilePage {...props} />);
  instance = wrapper.instance();
});

describe('ProfilePage', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('updateProfile', () => {
    it('updates profile correctly', async() => {
      await instance.updateProfile({ firstName: 'John', lastName: 'Doe' });
      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { first_name: 'John', last_name: 'Doe' });
      expect(props.updateCurrentUser).toHaveBeenCalledWith({ first_name: 'John', last_name: 'Doe' });
      expect(props.showAlert).toHaveBeenCalledTimes(0);
    });

    it('alerts on error', async() => {
      props.updateUser.mockReturnValue(Promise.reject(new Error('dooms day')));
      await instance.updateProfile({ firstName: 'John', lastName: 'Doe' });

      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { first_name: 'John', last_name: 'Doe' });
      expect(props.updateCurrentUser).toHaveBeenCalledTimes(0);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePassword', () => {
    it('updates password correctly', async() => {
      await instance.updatePassword({ currentPassword: '111', newPassword: '222' });
      expect(props.confirmPassword).toHaveBeenCalledWith('Lord Stark', '111');
      expect(props.updateUser).toHaveBeenCalledWith('Lord Stark', { password: '222' });
      expect(props.showAlert).toHaveBeenCalledTimes(0);
    });

    it('alerts on error', async() => {
      props.confirmPassword.mockReturnValue(Promise.reject(new Error('dooms day')));
      await instance.updatePassword({ currentPassword: '111', newPassword: '222' });
      expect(props.confirmPassword).toHaveBeenCalledWith('Lord Stark', '111');
      expect(props.updateUser).toHaveBeenCalledTimes(0);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
    });
  });
});
