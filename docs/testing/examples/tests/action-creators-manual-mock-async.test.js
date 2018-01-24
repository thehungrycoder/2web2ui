import { asyncMock, asyncDependent } from '../action-creators';
import * as mocks from '../_example-mocks';

jest.mock('../_example-mocks');

describe('Manually mocked async action creators', () => {

  beforeEach(() => {
    mocks.apiRequest = jest.fn((a) => a);
  });

  it('should dispatch 2 async calls', async() => {
    // here we create our own dispatch mock which always returns a promise
    // this works because all of the dispatches are async in this flow
    const dispatchMock = jest.fn(() => Promise.resolve());
    const thunk = asyncMock();
    await thunk(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(2);
    // jest.fn mocks store their calls here, which are easy to snapshot
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

  it('should dispatch multiple dependent calls', async() => {
    const dispatchMock = jest.fn(() => Promise.resolve()) // default return for dispatch mock
      // first time dispatch is called, will do this
      .mockImplementationOnce(() => Promise.resolve({ id: 5 }))
      // second time dispatch is called, will do this
      .mockImplementationOnce(() => Promise.resolve({ updated: true }));

    const thunk = asyncDependent({ name: 'Bobbi' });
    await thunk(dispatchMock);
    expect(dispatchMock).toHaveBeenCalledTimes(3);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
  });

});
