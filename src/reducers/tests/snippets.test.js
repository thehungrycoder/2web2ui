import snippetsReducer from '../snippets';

describe('Snippets Reducer', () => {
  it('returns default state', () => {
    expect(snippetsReducer()).toEqual({});
  });
});
