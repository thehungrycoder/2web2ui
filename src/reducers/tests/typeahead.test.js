import typeaheadReducer from '../typeahead';

describe('Reducer: Typeahead', () => {
  let action;

  beforeEach(() => {
    action = {
      type: 'UPDATE_TYPEAHEAD_METRICS_CACHE',
      payload: { from: 'date1', to: 'date2', itemToCache: { foo: {}}}
    };
  });

  it('should update the dates and clear the previous cache when a new date is set ', () => {

    const state = typeaheadReducer({
      from: null,
      to: null,
      cache: { bar: {}}
    }, action);
    expect(state.from).toEqual('date1');
    expect(state.to).toEqual('date2');
    expect(state.cache).toEqual({ foo: {}});
  });

  it('should only update the cache when a new item is sent with the same date', () => {

    const state = typeaheadReducer({
      from: 'date1',
      to: 'date2',
      cache: { bar: {}}
    }, action);
    expect(state.from).toEqual('date1');
    expect(state.to).toEqual('date2');
    expect(state.cache).toEqual({ foo: {}, bar: {}});
  });
});
