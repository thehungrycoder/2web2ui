import cases from 'jest-in-case';
import _ from 'lodash';
import * as utils from '../utils';
import { getFormDefinition } from '../eventsDefinitions';

jest.mock('../utils');

describe('Event Definitions', () => {
  let defaultAction;
  beforeEach(() => {
    utils.isWhitelistedForm = jest.fn(() => true);
    defaultAction = {
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
    const mockAction = _.assign({}, defaultAction, rest);

    expect(getFormDefinition(name, value)(mockAction)).toMatchSnapshot();
  }, TEST_CASES);

  describe('getFormDefinition', () => {
    it('invokes the callback when provided', () => {
      const fn = jest.fn().mockReturnValue({ action: 'Validation Error', label: 'formName: {"field1": "required"}' });
      expect(getFormDefinition(fn)(defaultAction)).toMatchSnapshot();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('returns null when form is not whitelisted', () => {
      utils.isWhitelistedForm = jest.fn(() => false);
      const fn = jest.fn().mockReturnValue({ action: 'Validation Error', label: 'formName: {"field1": "required"}' });
      expect(getFormDefinition(fn)(defaultAction)).toBe(null);
    });
  });
});
