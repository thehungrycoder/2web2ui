import typeaheadReducer from '../typeahead';
import { isSameDate } from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Reducer: Typeahead', () => {
  let action;
  let state;
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
    state = {
      cache: { bar: {}}
    };
  });

  it('should update the dates and clear the previous cache when a new date is set ', () => {

    isSameDate.mockImplementation(() => false);
    const newState = typeaheadReducer(state, action);
    expect(newState.from).toEqual(date1);
    expect(newState.to).toEqual(date2);
    expect(newState.cache).toEqual({ foo: {}});
  });

  it('should only update the cache when a new item is sent with the same date', () => {

    isSameDate.mockImplementation(() => true);
    const newState = typeaheadReducer(state, action);
    expect(newState.cache).toEqual({ foo: {}, bar: {}});
  });
});
