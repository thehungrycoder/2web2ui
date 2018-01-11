import _ from 'lodash';

export function getSortedCollection(collection, sortColumn, sortDirection) {
  return _.orderBy(collection, sortColumn, sortDirection);
}

/**
 * Handles sorting. It sets states. So this function must be invoked with the context of the component (bind `this` to the component being used)
 * @param {*} column column name like recipient
 * @param {*} direction direction of sorting like asc/desc
 */
export function handleSortChange(column, direction) {
  this.setState({ sortColumn: column, sortDirection: direction }, this.forceUpdate);
}
