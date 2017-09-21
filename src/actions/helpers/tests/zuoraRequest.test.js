import zuoraRequest from '../zuoraRequest';
import { createMockStore } from '__testHelpers__/mockStore';
import * as axiosMocks from '../axiosInstances';

jest.mock('../axiosInstances');

describe('Helper: Zuora API Request', () => {

  let mockStore;
  let action;
  let expectedResponse;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore({});
    action = { type: 'ZUORA_REQUEST', meta: {}};
    expectedResponse = { success: true }
    axiosMocks.zuora.mockImplementation(() => Promise.resolve(expectedResponse));
  });

  it('should make a successful call', async () => {
    const results = await mockStore.dispatch(zuoraRequest(action));
    expect(results).toBe(expectedResponse);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should handle a zuora failure', async () => {
    axiosMocks.zuora.mockImplementation(() => Promise.resolve({
      data: {
        success: false,
        reasons: [{ message: 'The credit card is bad and wrong' }]
      }
    }));

    try {
      await mockStore.dispatch(zuoraRequest(action));
    } catch (err) {
      expect(err.response).toBeDefined;
      expect(mockStore.getActions()).toMatchSnapshot();
    }
  });

});
