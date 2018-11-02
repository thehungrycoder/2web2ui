import snippetsReducer from '../snippets';
import cases from 'jest-in-case';

describe('Snippets Reducer', () => {
  it('CLEAR_SNIPPET', () => {
    const state = {
      getError: new Error('Oh no!'),
      getPending: true,
      item: {
        id: 'test-snippet'
      }
    };
    const action = {
      type: 'CLEAR_SNIPPET'
    };

    expect(snippetsReducer(state, action)).toMatchSnapshot();
  });

  cases('GET_SNIPPET', ({ name, ...action }) => {
    expect(snippetsReducer(undefined, action)).toMatchSnapshot();
  }, {
    'when fail': {
      type: 'GET_SNIPPET_FAIL',
      payload: {
        error: new Error('Oh no!')
      }
    },
    'when pending': {
      type: 'GET_SNIPPET_PENDING'
    },
    'when success': {
      type: 'GET_SNIPPET_SUCCESS',
      payload: [
        { id: 'example-snippet', name: 'Example Snippet' }
      ]
    }
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
