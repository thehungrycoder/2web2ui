import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import { CreatePage } from '../CreatePage';

cases('CreatePage', ({ name, ...props }) => {
  const wrapper = shallow(<CreatePage handleSubmit={() => {}} {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders upload form': {},
  'renders upload form with parsing error': {
    parseError: {
      message: 'Oh no, parsing!'
    },
    submitting: false,
    submitFailed: true
  },
  'renders upload form with persist error': {
    persistError: {
      message: 'Oh no, creating!'
    },
    submitting: false,
    submitFailed: true
  },
  'renders upload form with subaccount typeahead': {
    forSubaccount: true
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

    await instance.handleSubmit({
      subaccount: 999,
      suppressionsFile: { name: 'example.csv' }
    });

    expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
    expect(props.history.push).toHaveBeenCalled();
  });
});
