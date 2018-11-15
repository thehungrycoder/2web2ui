import React from 'react';
import { shallow } from 'enzyme';
import { EditPage } from '../EditPage';
import ConfirmationModal from 'src/components/modals/ConfirmationModal';

describe('Page: Users Edit', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn((handler) => handler),
      loadingError: false,
      listUsers: jest.fn(),
      deleteUser: jest.fn(() => Promise.resolve()),
      getAccountSingleSignOnDetails: jest.fn(),
      updateUser: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn()
      },
      isAccountSingleSignOnEnabled: true,
      match: {
        params: { id: 'test-user' }
      },
      currentUser: { name: 'current-user' },
      user: { access: 'admin', email: 'test-user@test.com', name: 'test-user' },
      users: {
        'current-user': { access: 'admin', email: 'current-user@test.com', name: 'current-user' },
        'test-user': { access: 'admin', email: 'test-user@test.com', name: 'test-user' }
      }
    };
    wrapper = shallow(<EditPage {...props} />);
    instance = wrapper.instance();
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get account single sign-on details on mount', () => {
    expect(props.getAccountSingleSignOnDetails).toHaveBeenCalled();
  });

  it('should not get list of users on mount if already loaded', () => {
    expect(props.listUsers).toHaveBeenCalledTimes(0);
  });

  it('should get list of users on mount', () => {
    shallow(<EditPage {...props} users={{}} />);
    expect(props.listUsers).toHaveBeenCalledTimes(1);
  });

  it('should redirect on loadingError', () => {
    wrapper.setProps({ loadingError: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should load until we have a list of users', () => {
    wrapper.setProps({ users: {}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should not allow current user to delete', () => {
    wrapper.setProps({
      user: {
        ...props.user,
        isCurrentUser: true
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should show a delete modal', () => {
    instance.toggleDelete();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should update a user', async () => {
    await instance.handleUserUpdate({ is_sso: true, access: 'admin' });
    expect(props.updateUser).toHaveBeenCalledWith('test-user', {
      is_sso: true,
      access_level: 'admin'
    });
  });

  it('should delete a user', async () => {
    await instance.deleteUser();
    expect(props.deleteUser).toHaveBeenCalledWith('test-user');
  });

  it('should redirect after delete or if user does not exist', () => {
    wrapper.setProps({ user: undefined });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show a disable-tfa modal', () => {
    instance.toggleTfaModal();
    expect(
      wrapper
        .find(ConfirmationModal)
        .first()
        .prop('open')
    ).toEqual(true);
  });

  it('should disable tfa', () => {
    wrapper
      .find(ConfirmationModal)
      .first()
      .prop('onConfirm')();
    expect(props.updateUser).toHaveBeenCalledTimes(1);
    expect(props.updateUser.mock.calls[0][1]).toMatchObject({ tfa_enabled: false });
  });
});
