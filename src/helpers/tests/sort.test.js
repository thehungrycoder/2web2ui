
import * as sortHelpers from '../sort';
import _ from 'lodash';

jest.mock('lodash');

describe('Sort helpers', () => {
  beforeEach(() => {
    _.orderBy = jest.fn();
  });

  it('sorts correctly with lodash sorting', () => {
    sortHelpers.getSortedCollection([], 'a', 'asc');
    expect(_.orderBy).toHaveBeenCalledWith([], 'a', 'asc');
  });
});


