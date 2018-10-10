import brightbackRequest from '../brightbackRequest';
import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as axiosMocks from 'src/helpers/axiosInstances';

jest.mock('src/helpers/axiosInstances');

describe('Helper: Brightback API Request', () => {

  let mockStore;
  let action;
  let expectedResponse;

  beforeEach(() => {
    mockStore = createMockStore({});
    action = { type: 'BRIGHTBACK_REQUEST', meta: {}};
    expectedResponse = { data: { valid: true }};
    axiosMocks.brightback.mockImplementation(() => Promise.resolve(expectedResponse));
  });

  it('should make a successful call', async () => {
    const results = await mockStore.dispatch(brightbackRequest(action));
    expect(results).toBe(expectedResponse.data);
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
