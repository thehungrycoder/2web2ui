import _ from 'lodash';

export function getSortedCollection(collection, sortColumn, sortDirection, columns = []) {
  return _.orderBy(collection, sortColumn, sortDirection);
}
