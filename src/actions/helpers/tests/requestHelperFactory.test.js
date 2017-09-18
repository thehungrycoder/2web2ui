import factory from '../requestHelperFactory';
const badSuccessError = new Error('Promise succeeded when it should have failed');

describe('Helper: Request Helper Factory', () => {

  it('should return a function', () => {
    expect(factory()).toBeInstanceOf(Function);
  });

  it('should return a function that returns a function when called', () => {
    const request = factory();
    expect(request()).toBeInstanceOf(Function);
  });

  describe('returned thunk action creator', () => {

    let dispatchMock;
    let getStateMock;
    let onSuccessMock;
    let onFailMock;
    let requestMock;
    let transformHttpOptionsMock;
    
    let response;
    let meta;
    let action;
  
    beforeEach(() => {
      response = {}
      meta = {};
      action = { type: 'TEST', meta };
  
      dispatchMock = jest.fn();
      getStateMock = jest.fn();
      onSuccessMock = jest.fn();
      onFailMock = jest.fn();
      onFailMock.mockImplementation(({ err }) => {
        throw err;
      });
      requestMock = jest.fn(() => Promise.resolve(response));
      transformHttpOptionsMock = jest.fn();
    });

    it('should dispatch a default success event', () => {
      const request = factory({
        request: requestMock,
        transformHttpOptions: transformHttpOptionsMock
      });
  
      return request(action)(dispatchMock, getStateMock).then((result) => {
        expect(dispatchMock).toHaveBeenCalledTimes(2);
        
        const pendingAction = dispatchMock.mock.calls[0][0];
        expect(pendingAction.type).toEqual('TEST_PENDING');
        expect(pendingAction.meta).toBe(meta);
  
        const successAction = dispatchMock.mock.calls[1][0];
        expect(successAction.type).toEqual('TEST_SUCCESS');
        expect(successAction.payload).toBe(response);
        expect(successAction.meta).toBe(meta);
  
        expect(requestMock).toHaveBeenCalled();
        expect(transformHttpOptionsMock).toHaveBeenCalled();
      });
    });
  
    it('should dispatch a default failure event', () => {
      const err = new Error('a message');
      err.response = {};
      requestMock = jest.fn(() => Promise.reject(err));

      const request = factory({
        request: requestMock
      });

      expect.hasAssertions();
      return request(action)(dispatchMock, getStateMock)
        .catch((err) => {
          expect(dispatchMock).toHaveBeenCalledTimes(2);
          
          const pendingAction = dispatchMock.mock.calls[0][0];
          expect(pendingAction.type).toEqual('TEST_PENDING');
          expect(pendingAction.meta).toBe(meta);
    
          const failAction = dispatchMock.mock.calls[1][0];
          expect(failAction.type).toEqual('TEST_FAIL');
          expect(failAction.payload).toEqual({ message: err.message, response });
          expect(failAction.meta).toBe(meta);
        });
    });

    it('should run custom success handler', () => {
      const request = factory({
        request: requestMock,
        onSuccess: onSuccessMock,
        onFail: onFailMock
      });

      return request(action)(dispatchMock, getStateMock).then(() => {
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(onSuccessMock).toHaveBeenCalledTimes(1);
        expect(onFailMock).not.toHaveBeenCalled();

        const pendingAction = dispatchMock.mock.calls[0][0];
        expect(pendingAction.type).toEqual('TEST_PENDING');
        expect(pendingAction.meta).toBe(meta);
      });
    });

    it('should run custom fail handler', () => {
      const err = new Error('a message');
      err.response = {};
      requestMock = jest.fn(() => Promise.reject(err));

      const request = factory({
        request: requestMock,
        onFail: onFailMock
      });

      expect.hasAssertions();

      return request(action)(dispatchMock, getStateMock)
        .catch((err) => {
          expect(dispatchMock).toHaveBeenCalledTimes(1);
          expect(onFailMock).toHaveBeenCalledTimes(1);
          expect(onSuccessMock).not.toHaveBeenCalled();

          const pendingAction = dispatchMock.mock.calls[0][0];
          expect(pendingAction.type).toEqual('TEST_PENDING');
          expect(pendingAction.meta).toBe(meta);
        });
    });

  });
  

});