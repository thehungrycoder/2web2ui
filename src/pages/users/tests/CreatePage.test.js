import React from 'react';
import { shallow } from 'enzyme';
import { CreatePage } from '../CreatePage';

describe('Page: User Create Page', () => {

  let props;
  let wrapper;
  let instance;
  let values;

  beforeEach(() => {
    props = {
      submitting: false,
      pristine: false,
      handleSubmit: jest.fn((fn) => fn),
      inviteUser: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      }
    };
    props.inviteUser.mockName('inviteUserMock');
    wrapper = shallow(<CreatePage {...props} />);
    instance = wrapper.instance();
    values = { email: 'email', access: 'access' };
  });

  it('should render correctly by default', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render when pristine', () => {
    wrapper.setProps({ pristine: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should invite a user on submit', async() => {
    await instance.handleSubmit(values);

    expect(props.inviteUser).toHaveBeenCalledWith(values.email, values.access);
    expect(props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: `Invitation sent to ${values.email}`
    });
    expect(props.history.push).toHaveBeenCalledWith('/account/users');
  });

  it('should show an alert on a 400 error', async() => {
    const err = { response: { status: 400 }};
    props.inviteUser.mockImplementation(() => Promise.reject(err));

    await instance.handleSubmit(values);

    expect(props.inviteUser).toHaveBeenCalledWith(values.email, values.access);
    expect(props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'The email you tried to invite is currently suppressed by SparkPost. Please use another email address or contact support.'
    });
    expect(props.history.push).not.toHaveBeenCalled();
  });

  it('should show an alert on a 409 error', async() => {
    const err = { response: { status: 409, data: {
      errors: [
        { message: 'the real error message' }
      ]
    }}};
    props.inviteUser.mockImplementation(() => Promise.reject(err));

    await instance.handleSubmit(values);

    expect(props.inviteUser).toHaveBeenCalledWith(values.email, values.access);
    expect(props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'the real error message'
    });
    expect(props.history.push).not.toHaveBeenCalled();
  });

  it('should show an alert on a 500 error', async() => {
    const err = { response: { status: 500 }};
    props.inviteUser.mockImplementation(() => Promise.reject(err));

    await instance.handleSubmit(values);

    expect(props.inviteUser).toHaveBeenCalledWith(values.email, values.access);
    expect(props.showAlert).toHaveBeenCalledWith({
      type: 'error',
      message: 'Unable to invite user.'
    });
    expect(props.history.push).not.toHaveBeenCalled();
  });

});
