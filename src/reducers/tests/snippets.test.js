import snippetsReducer from '../snippets';
import cases from 'jest-in-case';

describe('Snippets Reducer', () => {
  it('returns default state', () => {
    expect(snippetsReducer()).toMatchSnapshot();
  });

  cases('GET_SNIPPETS', ({ name, ...action }) => {
    expect(snippetsReducer(undefined, action)).toMatchSnapshot();
  }, {
    'when fail': {
      type: 'GET_SNIPPETS_FAIL',
      payload: {
        error: new Error('Oh no!')
      }
    },
    'when pending': {
      type: 'GET_SNIPPETS_PENDING'
    },
    'when success': {
      type: 'GET_SNIPPETS_SUCCESS',
      payload: [
        { id: 'example-snippet', name: 'Example Snippet' }
      ]
    }
  });
});
