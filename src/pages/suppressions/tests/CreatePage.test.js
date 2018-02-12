import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import { SubmissionError } from 'redux-form';

import { CreatePage } from '../CreatePage';

cases('CreatePage', ({ name, ...props }) => {
  const wrapper = shallow(<CreatePage handleSubmit={() => {}} {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders upload form': {},
  'renders upload form with parsing error details': {
    parseError: {
      details: [
        { row: undefined, message: 'Unable to auto detect delimiter' },
        { row: 0, message: 'Wrong number of columns' },
        { row: 1, message: 'Wrong number of columns' }
      ]
    },
    submitting: false
  },
  'renders upload form with parsing error too many details': {
    parseError: {
      details: [
        ...Array.from(Array(100), (v, i) => ({ row: i, message: 'Oh no!' }))
      ]
    },
    submitting: false
  },
  'renders upload form with parsing error message': {
    parseError: {
      message: 'Oh no, parsing!'
    },
    submitting: false
  },
  'renders upload form with persist error': {
    persistError: {
      response: {
        data: {
          errors: [
            { message: 'Oh no, creating!' }
          ]
        }
      }
    },
    submitting: false
  },
  'renders disabled upload form when submitting': {
    submitting: true
  }
});

describe('CreatePage.handleSubmit', async() => {
  it('displays an alert and redirects after successful upload', async() => {
    const props = {
      history: { push: jest.fn() },
      showAlert: jest.fn(),
      uploadSuppressions: jest.fn(() => Promise.resolve())
    };
    const instance = new CreatePage(props);
    const args = {
      subaccount: 999,
      suppressionsFile: { name: 'example.csv' }
    };

    await instance.handleSubmit(args);

    expect(props.uploadSuppressions).toHaveBeenCalledWith(args.suppressionsFile, args.subaccount);
    expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
    expect(props.history.push).toHaveBeenCalled();
  });

  it('rethrows unexpected errors as SubmissionError', async() => {
    const props = {
      uploadSuppressions: jest.fn(() => Promise.reject(new Error('Oh no!')))
    };
    const instance = new CreatePage(props);
    const args = {
      subaccount: 999,
      suppressionsFile: { name: 'example.csv' }
    };

    await expect(instance.handleSubmit(args)).rejects.toThrowError(SubmissionError);
  });
});
