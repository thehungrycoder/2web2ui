import cases from 'jest-in-case';
import _ from 'lodash';

import { getFormDefinition } from '../eventsDefinitions';

describe('Event Defintions', () => {
  let mockAction;
  beforeEach(() => {
    mockAction = {
      type: null,
      meta: {
        form: 'formName'
      },
      payload: {}
    };
  });

  const TEST_CASES = {
    'Initialize': null,
    'Submit': { value: 1 },
    'Submit Failure': {},
    'Submit Success': {},
    'Validation Success': {}
  };

  cases('getFormDefinition', ({ name, value, ...rest }) => {
    mockAction = _.assign(mockAction, rest);

    expect(getFormDefinition(name, value)(mockAction)).toMatchSnapshot();
  }, TEST_CASES);

  describe('getFormDefinition', () => {
    it('invokes the callback when provided', () => {
      const fn = jest.fn().mockReturnValue({ action: 'Validation Error', label: 'formName: {"field1": "required"}' });
      expect(getFormDefinition(fn)(mockAction)).toMatchSnapshot();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
