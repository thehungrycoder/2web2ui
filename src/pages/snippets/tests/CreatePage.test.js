import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import { CreatePage, getInitialValues } from '../CreatePage';

describe('CreatePage', () => {
  const subject = (props) => shallow(
    <CreatePage handleSubmit={(fn) => fn} {...props} />
  );

  it('renders form', () => {
    expect(subject({ location: {}})).toMatchSnapshot();
  });

  it('renders form with subaccount assignment', () => {
    expect(subject({ hasSubaccounts: true, location: {}})).toMatchSnapshot();
  });

  it('gets a snippet if passed data from router', () => {
    const getSnippet = jest.fn(() => Promise.resolve());
    const props = {
      getSnippet,
      location: {
        state: {
          id: 'testid',
          subaccount_id: 101
        }
      }
    };
    subject(props);
    expect(getSnippet).toHaveBeenCalledWith({ id: 'testid', subaccountId: 101 });
  });

  it('redirects when submit succeeds', () => {
    const props = {
      history: {
        push: jest.fn()
      },
      location: {}
    };

    const wrapper = subject(props);
    wrapper.setProps({ submitSucceeded: true });

    expect(props.history.push).toHaveBeenCalledWith('/snippets');
  });

  it('triggers create snippet action when primary action is clicked', () => {
    const props = {
      createSnippet: jest.fn(() => Promise.resolve()),
      location: {}
    };
    const wrapper = subject(props);

    wrapper.prop('primaryAction').onClick({});
    expect(props.createSnippet).toHaveBeenCalled();
  });

  describe('.submitSnippet', () => {
    cases('succeeds', ({ name, ...values }) => {
      const createSnippet = jest.fn(() => Promise.resolve());
      const wrapper = subject({ createSnippet, location: {}});

      wrapper.prop('primaryAction').onClick({
        ...values,
        id: 'example-snippet',
        name: 'Example Snippet'
      });

      expect(createSnippet).toMatchSnapshot();
    }, {
      'with content': {
        content: {
          html: '<p>testing...</p>',
          text: 'testing...'
        }
      },
      'with master account assignment': {
        assignTo: 'master'
      },
      'with shared subaccounts assignment': {
        assignTo: 'shared'
      },
      'with a subaccount assignment': {
        assignTo: 'subaccount',
        subaccount: {
          id: 'example-subaccount'
        }
      }
    });
  });

  describe('duplicate', () => {
    cases('succeeds', ({ name, ...values }) => {
      const state = {
        subaccounts: {
          list: [{ id: values.subaccount_id, name: 'bestsub' }]
        },
        snippets: {
          snippet: {
            ...values,
            id: 'testid',
            name: 'Testing Snippets',
            content: {
              html: 'hello',
              text: 'world'
            }
          }
        }
      };
      const props = {
        location: {
          state: {
            id: 'testid',
            subaccount_id: values.subaccount_id
          }
        }
      };

      expect(getInitialValues(state, props)).toMatchSnapshot();
    }, {
      'master account': {
        assignTo: 'master'
      },
      'shared with subaccounts': {
        assignTo: 'shared',
        shared_with_subaccounts: true
      },
      'subaccount': {
        assignTo: 'subaccount',
        subaccount_id: 101
      }
    });
  });
});
