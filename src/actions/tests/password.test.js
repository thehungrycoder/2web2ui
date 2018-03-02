import * as password from '../password';
import { sparkpost as sparkpostRequest } from 'src/helpers/axiosInstances';
jest.mock('src/helpers/axiosInstances');

describe('Action Creator: Password', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    sparkpostRequest.mockImplementation((a) => Promise.resolve(a));
  });

  describe('sendPasswordResetEmail', () => {
    it('sends with username', async() => {
      const thunk = password.sendPasswordResetEmail({ user: 'username' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { username: 'username' },
        method: 'POST',
        url: '/users/password/forgot'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('sends with email', async() => {
      const thunk = password.sendPasswordResetEmail({ user: 'user@email.com' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { email: 'user@email.com' },
        method: 'POST',
        url: '/users/password/forgot'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('handles error', async() => {
      sparkpostRequest.mockImplementation(() => Promise.reject('error'));
      const thunk = password.sendPasswordResetEmail({ user: 'user@email.com' });
      await thunk(dispatchMock);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });
  });

  describe('resetPassword', () => {
    it('handles success', async() => {
      const thunk = password.resetPassword({ password: '12345', token: 'faketoken' });
      await thunk(dispatchMock);
      expect(sparkpostRequest).toHaveBeenCalledWith({
        data: { password: '12345' },
        method: 'POST',
        headers: { Authorization: 'faketoken' },
        url: '/users/password/reset'
      });
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });

    it('handles error', async() => {
      sparkpostRequest.mockImplementation(() => Promise.reject('error'));
      const thunk = password.resetPassword({ password: '12345', token: 'faketoken' });
      await thunk(dispatchMock);
      expect(dispatchMock.mock.calls).toMatchSnapshot();
    });
  });
});
