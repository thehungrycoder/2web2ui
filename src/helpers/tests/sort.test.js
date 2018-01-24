
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

  it('calls orderBy with column name if comparator does not exist', () => {
    sortHelpers.getSortedCollection(collection, 'id', 'asc', columns);
    expect(_.orderBy).toHaveBeenCalledWith(collection, 'id', 'asc');
  });

  it('calls comparator function when provided', () => {
    const idComparator = jest.fn((row) => parseInt(row.id, 10));
    columns[1].comparator = idComparator;

    sortHelpers.getSortedCollection(collection, 'id', 'asc', columns);
    expect(_.orderBy).toHaveBeenCalledWith(collection, idComparator, 'asc');
  });
});


