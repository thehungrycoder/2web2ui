import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as brightback from '../brightback';

jest.mock('../helpers/brightbackRequest', () => jest.fn((a) => a));

describe('Action Creator: Brightback', () => {
  let mockStore;

  beforeEach(() => {
    mockStore = createMockStore({});
  });

  it('should dispatch a precancel action', () => {
    mockStore.dispatch(brightback.precancel({ test: 'data' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
