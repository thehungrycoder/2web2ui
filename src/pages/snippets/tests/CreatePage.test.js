import React from 'react';
import { SubmissionError } from 'redux-form';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import { CreatePage } from '../CreatePage';

describe('CreatePage', () => {
  const subject = (props) => shallow(
    <CreatePage handleSubmit={(fn) => fn} {...props} />
  );

  it('renders form', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders form with subaccount assignment', () => {
    expect(subject({ hasSubaccounts: true })).toMatchSnapshot();
  });

  it('redirects when submit succeeds', () => {
    const props = {
      history: {
        push: jest.fn()
      }
    };

    const wrapper = subject(props);
    wrapper.setProps({ submitSucceeded: true });

    expect(props.history.push).toHaveBeenCalledWith('/snippets');
  });

  it('triggers create snippet action when primary action is clicked', () => {
    const props = {
      createSnippet: jest.fn(() => Promise.resolve())
    };
    const wrapper = subject(props);

    wrapper.prop('primaryAction').onClick({});
    expect(props.createSnippet).toHaveBeenCalled();
  });

  describe('.submitSnippet', () => {
    cases('succeeds', ({ name, ...values }) => {
      const createSnippet = jest.fn(() => Promise.resolve());
      const wrapper = subject({ createSnippet });

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

    it('throws submission error when createSnippet fails', async () => {
      const props = {
        createSnippet: jest.fn(() => Promise.reject(new Error('Oh no!')))
      };
      const instance = subject(props).instance();

      await expect(instance.submitSnippet({})).rejects.toThrowError(SubmissionError);
    });
  });
});
