import _ from 'lodash';

export function getSortedCollection(collection, sortColumn, sortDirection) {
  return _.orderBy(collection, sortColumn, sortDirection);
}
