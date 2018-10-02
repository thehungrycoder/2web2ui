import { objectSortMatch } from 'src/helpers/sortMatch';
const objectValuesToString = (keys) => (item) => (keys || Object.keys(item)).map((key) => item[key]).join(' ');

/*
 * Filter a fixed rowset using objectSortMatch()
 */
const filter = (rows, pattern = '', { keyMap, itemToStringKeys, matchThreshold } = {}) => {
  if (!pattern) {
    return { rows, rowCount: rows.length };
  }
  const filtered = objectSortMatch({
    items: rows,
    pattern,
    getter: objectValuesToString(itemToStringKeys),
    keyMap,
    matchThreshold
  });
  return {
    rows: filtered,
    rowCount: filtered.length
  };
};

export const filteringModel = (rows, options) => ({ pattern } = {}) => filter(rows, pattern, options);

/*
 * Construct a single "page" of results from a fixed rowset
 */
const paginate = (rows, currentPage = 1, perPage = 25) => {
  const currentIndex = (currentPage - 1) * perPage;
  return {
    rows: rows.slice(currentIndex, currentIndex + perPage),
    rowCount: rows.length
  };
};

export const paginatingModel = (rows) => ({ currentPage, perPage } = {}) => paginate(rows, currentPage, perPage);

/*
 * Create a filter/pagination function for a fixed list of records. This is meant for use
 * as a fetchRows implementation for a Collection.
 */
export const fullModel = (rows, { keyMap = {}, itemToStringKeys, matchThreshold } = {}) =>
  ({ pattern, currentPage, perPage } = {}) => {
    const { rows: filtered, rowCount } = filter(rows, pattern, { keyMap, itemToStringKeys, matchThreshold });
    return {
      rows: paginate(filtered, currentPage, perPage).rows,
      rowCount
    };
  };
