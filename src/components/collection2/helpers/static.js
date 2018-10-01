import { objectSortMatch } from 'src/helpers/sortMatch';
const objectValuesToString = (keys) => (item) => (keys || Object.keys(item)).map((key) => item[key]).join(' ');

export const staticFilter = (rows, pattern, keyMap, itemToStringKeys, matchThreshold) => {
  if (!pattern) {
    return rows;
  }
  return objectSortMatch({
    items: rows,
    pattern,
    getter: objectValuesToString(itemToStringKeys),
    keyMap,
    matchThreshold
  });
};

export const staticPaginator = (rows, currentPage, perPage) => {
  const currentIndex = (currentPage - 1) * perPage;
  return {
    rows: rows.slice(currentIndex, currentIndex + perPage),
    rowCount: rows.length
  };
};

/*
 * Create a filter/pagination function for a fixed list of records. This is meant for use
 * as a fetchRows implementation for a Collection.
 */
export const staticRowModel = (rows, { keyMap = {}, itemToStringKeys } = {}) =>
  ({ pattern = '', currentPage = 1, perPage = 2 }) => staticPaginator(staticFilter(rows, pattern, keyMap, itemToStringKeys), currentPage, perPage);
