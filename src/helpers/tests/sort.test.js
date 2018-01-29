
import * as sortHelpers from '../sort';
import _ from 'lodash';

describe('Sort helpers', () => {
  let columns;
  let collection;

  beforeEach(() => {
    _.orderBy = jest.fn();
    columns = [
      { label: 'Name', sortKey: 'name' },
      { label: 'ID', sortKey: 'id' }
    ];

    collection = [
      { name: 'foo', id: '101' },
      { name: 'bar', id: '100' }
    ];
  });

  it('sorts correctly with lodash sorting', () => {
    sortHelpers.getSortedCollection(collection, 'name', 'asc');
    expect(_.orderBy).toHaveBeenCalledWith(collection, 'name', 'asc');
  });

  it('calls orderBy correctly when sortColumn is a function', () => {
    const mockFunction = jest.fn();
    sortHelpers.getSortedCollection(collection, mockFunction, 'asc', columns);
    expect(_.orderBy).toHaveBeenCalledWith(collection, mockFunction, 'asc');
  });
});


