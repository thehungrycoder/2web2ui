import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import { ErrorBanner } from '../ErrorBanner';

cases('ErrorBanner tests', ({ name, ...props }) => {
  const wrapper = shallow(<ErrorBanner {...props} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'renders upload form with parsing error details': {
    parseError: {
      details: [
        { row: undefined, message: 'Unable to auto detect delimiter' },
        { row: 0, message: 'Wrong number of columns' },
        { row: 1, message: 'Wrong number of columns' }
      ]
    }
  },
  'renders upload form with parsing error too many details': {
    parseError: {
      details: [
        ...Array.from(Array(100), (v, i) => ({ row: i, message: 'Oh no!' }))
      ]
    }
  },
  'renders upload form with parsing error message': {
    parseError: {
      message: 'Oh no, parsing!'
    }
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
    }
  }
});

