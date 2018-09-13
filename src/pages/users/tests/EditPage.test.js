import React from 'react';
import { shallow } from 'enzyme';
import { EditPage } from '../EditPage';

describe('Page: Users Edit', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      handleSubmit: jest.fn(),
      loadingError: false,
      listUsers: jest.fn(),
      updateUser: jest.fn(() => Promise.resolve()),
      deleteUser: jest.fn(() => Promise.resolve()),
      history: {
        push: jest.fn()
      },
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
    expect(props.listUsers).toHaveBeenCalledTimes(1);
  });

  it('should show a delete modal', () => {
    instance.toggleDelete();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should update a user', async () => {
    await instance.handleUserUpdate({ is_sso: true, access: 'admin' });
    expect(props.updateUser).toHaveBeenCalledWith('test-user', { is_sso: true, access_level: 'admin' });
  });

  it('should delete a user', async () => {
    await instance.deleteUser();
    expect(props.deleteUser).toHaveBeenCalledWith('test-user');
  });

  it('should redirect after delete', async () => {
    await instance.deleteUser();
    expect(props.history.push).toHaveBeenCalledWith('/account/users');
  });
});
