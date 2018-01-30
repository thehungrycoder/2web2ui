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

  describe('registerUser', () => {
    it('should show appropriate alert on success', async() => {
      const thunk = userActions.registerUser('token', { prop: 'value' });
      await thunk(dispatchMock);
      expect(showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Welcome to SparkPost'
      });

    });

    it('should show appropriate alert on error', async() => {
      const error = new Error('you failed');
      dispatchMock.mockImplementationOnce(() => Promise.reject(error));

      const thunk = userActions.registerUser('token', { prop: 'value' });
      await thunk(dispatchMock).catch((err) => {
        expect(showAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'Unable to register user.',
          details: 'you failed'
        });

        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteUser', () => {
    it('should show appropriate alert on success', async() => {
      const thunk = userActions.deleteUser('user');
      await thunk(dispatchMock);
      expect(showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Deleted user'
      });

    });

    it('should show appropriate alert on error', async() => {
      const error = new Error('you failed');
      dispatchMock.mockImplementationOnce(() => Promise.reject(error));

      const thunk = userActions.deleteUser('token', { prop: 'value' });
      await thunk(dispatchMock).catch(() => {
        expect(showAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'Unable to delete user.'
        });
      });
    });
  });

  describe('updateUser', () => {
    it('should show appropriate alert on success', async() => {
      dispatchMock.mockImplementationOnce(() => Promise.resolve({ message: 'update success' }));
      const thunk = userActions.updateUser('user', { key: 'value' });
      await thunk(dispatchMock);
      expect(showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'update success'
      });

    });

    it('should show appropriate alert on error', async() => {
      const error = new Error('you failed');
      dispatchMock.mockImplementationOnce(() => Promise.reject(error));

      const thunk = userActions.updateUser('user', { prop: 'value' });
      await thunk(dispatchMock).catch(() => {
        expect(showAlert).toHaveBeenCalledWith({
          type: 'error',
          message: 'Unable to update role for user.'
        });
      });
    });
  });

});

