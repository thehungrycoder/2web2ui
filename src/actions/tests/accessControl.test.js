import { initializeAccessControl } from '../accessControl';
import { fetch as fetchAccount, getPlans } from 'src/actions/account';
import { get as getCurrentUser, getGrants } from 'src/actions/currentUser';

jest.mock('src/actions/account');
jest.mock('src/actions/currentUser');

describe('Action: Initialize Access Control', () => {

  beforeEach(() => {
    fetchAccount.mockImplementation(() => Promise.resolve('test-account'));
    getPlans.mockImplementation(() => Promise.resolve('test-plans'));
    getCurrentUser.mockImplementation(() => Promise.resolve({ access_level: 'EQUISAPIEN' }));
    getGrants.mockImplementation(() => Promise.resolve('test-grants'));
  });

  it('should initialize access control with a series of calls', async () => {
    const dispatchMock = jest.fn((a) => a);
    await initializeAccessControl()(dispatchMock);

    expect(fetchAccount).toHaveBeenCalledTimes(1);
    expect(getPlans).toHaveBeenCalledTimes(1);
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
    expect(getGrants).toHaveBeenCalledWith({ role: 'EQUISAPIEN' });
    expect(dispatchMock).toHaveBeenCalledTimes(5);
    expect(dispatchMock).toHaveBeenLastCalledWith({
      type: 'ACCESS_CONTROL_READY'
    });
  });

});
