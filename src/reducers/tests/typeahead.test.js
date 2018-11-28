import typeaheadReducer from '../typeahead';

describe('Reducer: Typeahead', () => {
  let action;
  const date1 = new Date(2018, 11, 24, 10, 0, 0, 0);
  const date2 = new Date(2018, 11, 25, 10, 0, 0, 0);
  beforeEach(() => {
    action = {
      type: 'UPDATE_TYPEAHEAD_METRICS_CACHE',
      payload: {
        from: date1,
        to: date2,
        itemToCache: { foo: {}}}
    };
  });

  it('should update the dates and clear the previous cache when a new date is set ', () => {

    const state = typeaheadReducer({
      from: null,
      to: null,
      cache: { bar: {}}
    }, action);
    expect(state.from).toEqual(date1);
    expect(state.to).toEqual(date2);
    expect(state.cache).toEqual({ foo: {}});
  });

  it('should only update the cache when a new item is sent with the same date', () => {

    const state = typeaheadReducer({
      from: new Date(2018, 11, 24, 10, 0, 0, 0),
      to: new Date(2018, 11, 25, 10, 0, 0, 0),
      cache: { bar: {}}
    }, action);
    expect(state.from).toEqual(date1);
    expect(state.to).toEqual(date2);
    expect(state.cache).toEqual({ foo: {}, bar: {}});
  });
});
