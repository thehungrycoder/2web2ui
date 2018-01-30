import * as userActions from '../users';
import { showAlert } from 'src/actions/globalAlert';
import { sparkpost as spReq } from 'src/helpers/axiosInstances';

jest.mock('src/helpers/axiosInstances');
jest.mock('src/actions/globalAlert');

describe('Action Creator: users', () => {
  let dispatchMock;

  beforeEach(() => {
    spReq.mockImplementation(() => Promise.resolve());
    dispatchMock = jest.fn((a) => Promise.resolve(a));
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
      spReq.mockImplementation(() => Promise.reject(error));

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

  describe('updateUser', () => {

  });

});

