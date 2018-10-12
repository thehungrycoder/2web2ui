import React from 'react';
import { SubmissionError } from 'redux-form';
import { shallow } from 'enzyme';
import { CreatePage } from '../CreatePage';

describe('CreatePage', () => {
  const subject = (props) => shallow(
    <CreatePage handleSubmit={(fn) => fn} {...props} />
  );

  it('renders form', () => {
    expect(subject()).toMatchSnapshot();
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
    const values = {};

    wrapper.prop('primaryAction').onClick(values);

    expect(props.createSnippet).toHaveBeenCalledWith(values);
  });

  it('throws submission error when create snippet action fails', async () => {
    const props = {
      createSnippet: jest.fn(() => Promise.reject(new Error('Oh no!')))
    };
    const instance = subject(props).instance();

    await expect(instance.submitSnippet()).rejects.toThrowError(SubmissionError);
  });
});
