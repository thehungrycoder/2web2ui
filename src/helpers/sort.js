import _ from 'lodash';

export function getSortedCollection(collection, sortColumn, sortDirection, columns = []) {
  const { comparator } = _.find(columns, { sortKey: sortColumn }) || {};
  return _.orderBy(collection, comparator || sortColumn, sortDirection);
}
