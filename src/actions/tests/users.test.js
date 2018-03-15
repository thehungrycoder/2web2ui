import * as userActions from '../users';
import { showAlert } from 'src/actions/globalAlert';
import { sparkpost as spReq } from 'src/helpers/axiosInstances';

jest.mock('src/helpers/axiosInstances');
jest.mock('src/actions/globalAlert');

describe('Action Creator: users', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    spReq.mockImplementation = jest.fn((a) => Promise.resolve(a));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('.registerUser should show appropriate alert on success', async() => {
    const thunk = userActions.registerUser('token', { prop: 'value' });
    await thunk(dispatchMock);
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Welcome to SparkPost'
    });
  });

  it('.deleteUser should show appropriate alert on success', async() => {
    const thunk = userActions.deleteUser('user');
    await thunk(dispatchMock);
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Deleted user'
    });
  });

  it('.updateUser should show appropriate alert on success', async() => {
    dispatchMock.mockImplementationOnce(() => Promise.resolve({ message: 'update success' }));
    const thunk = userActions.updateUser('user', { key: 'value' });
    await thunk(dispatchMock);
    expect(showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'update success'
    });
  });
});
