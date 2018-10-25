import snippetsReducer from '../snippets';
import cases from 'jest-in-case';

describe('Snippets Reducer', () => {
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

  cases('DELETE_SNIPPET', ({ name, ...action }) => {
    const state = {
      items: [
        { id: 'deleteMe' },
        { id: 'deleteMe', subaccount_id: 101 }
      ]
    };
    expect(snippetsReducer(state, action)).toMatchSnapshot();
  }, {
    'when fail': {
      type: 'DELETE_SNIPPET_FAIL',
      payload: {
        error: new Error('Oh no!')
      },
      meta: { context: { id: 'deleteMe' }}
    },
    'when pending': {
      type: 'DELETE_SNIPPET_PENDING',
      meta: { context: { id: 'deleteMe' }}
    },
    'when success (master)': {
      type: 'DELETE_SNIPPET_SUCCESS',
      meta: { context: { id: 'deleteMe' }}
    },
    'when success (subaccount)': {
      type: 'DELETE_SNIPPET_SUCCESS',
      meta: { context: { id: 'deleteMe', subaccountId: 101 }}
    }
  });
});
