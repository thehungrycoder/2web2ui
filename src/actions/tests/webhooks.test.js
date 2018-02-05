import { createMockStore } from 'src/__testHelpers__/mockStore';
import * as webhooks from '../webhooks';
import * as webhookHelpers from 'src/helpers/webhooks';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));
jest.mock('src/helpers/webhooks');

describe('Action Creator: Webhooks', () => {
  let mockStore;
  let dispatchMock;

  beforeEach(() => {
    mockStore = createMockStore({});
    dispatchMock = jest.fn((a) => Promise.resolve(a));
    webhookHelpers.mergeWebhooks = jest.fn();
  });

  it('should dispatch a list action', () => {
    mockStore.dispatch(webhooks.listWebhooks());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a list all webhooks action', async() => {
    const thunk = webhooks.listAllWebhooks();
    await thunk(dispatchMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
    expect(webhookHelpers.mergeWebhooks).toHaveBeenCalled();
  });

  it('should catch dispatch a list all webhooks failure', async() => {
    dispatchMock = jest.fn(() => Promise.resolve())
      .mockImplementationOnce(() => Promise.resolve())
      .mockImplementationOnce(() => Promise.reject('error'));
    const thunk = webhooks.listAllWebhooks();
    await thunk(dispatchMock);
    expect(dispatchMock.mock.calls).toMatchSnapshot();
    expect(webhookHelpers.mergeWebhooks).not.toHaveBeenCalled();
  });

  it('should dispatch a get action', () => {
    mockStore.dispatch(webhooks.getWebhook({ id: 100 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get action with sub', () => {
    mockStore.dispatch(webhooks.getWebhook({ id: 100, subaccount: 101 }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a create action', () => {
    mockStore.dispatch(webhooks.createWebhook({ name: 'a webhook' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch an update action', () => {
    mockStore.dispatch(webhooks.updateWebhook({ id: '123', name: 'another webhook' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a delete action', () => {
    mockStore.dispatch(webhooks.deleteWebhook({ id: '123' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a test action', () => {
    mockStore.dispatch(webhooks.testWebhook({ id: '123', message: 'request message' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a get batches action', () => {
    mockStore.dispatch(webhooks.getBatches({ id: '123', message: 'request message' }));
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getEventDocs action', () => {
    mockStore.dispatch(webhooks.getEventDocs());
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('should dispatch a getEventSamples action', () => {
    mockStore.dispatch(webhooks.getEventSamples(['event1', 'event2']));
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
