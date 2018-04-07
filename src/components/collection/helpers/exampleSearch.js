import _ from 'lodash';
const MAX_EXAMPLE_VALUE_LENGTH = 50;
export const GENERIC_EXAMPLES = ['myKey:123dF9', 'myKey:"Some Value"', 'myKey:true'];

export const isValidExampleValue = (row, key) => (
  typeof row[key] !== 'undefined' &&
  typeof row[key] !== 'object' &&
  row[key] !== null &&
  row[key] !== ''
);

/**
 * Takes a data set and a list of example modifiers and provides real example
 * values from the given data set, returning an array of key:value combinations
 *
 * Args are (rows, options) so that memoization can be done easily on the rows list
 *
 * @param {Array} rows Data set to use for deriving example values
 * @param {Object} options
 * @param {Array|String} options.exampleModifiers List of keys to use as example modifiers, or hard-coded example modifier string
 * @param {Array} options.keyMap Hash for mapping friendly keys to their real key names in the data set, e.g. friendly: 'realKey'
 */
export function createExampleSearches(rows, { exampleModifiers = [], keyMap = {}, MAX_LENGTH = MAX_EXAMPLE_VALUE_LENGTH }) {

  const converted = exampleModifiers.map((modifier) => {
    const realKey = keyMap[modifier] || modifier;
    const rowWithValue = rows.find((row) => isValidExampleValue(row, realKey));

    // If no valid example values were found for this modifier key, skip it (we'll filter out false values later)
    if (!rowWithValue) {
      return false;
    }

    let value = rowWithValue[realKey];

    // If the value is a string longer than our max, truncate and trim trailing spaces
    if (typeof value === 'string' && value.length > MAX_LENGTH) {
      value = value.substr(0, MAX_LENGTH).trim();
    }

    // If the stringified value contains spaces, surround value in double quotes
    if (String(value).includes(' ')) {
      value = `"${value}"`;
    }

    // Return the key:value pair in string format
    return `${modifier}:${value}`;
  });

  // Filter out falsey values
  const results = converted.filter((pair) => pair);

  // Don't guess at keys that are searchable or return an empty list, use a generic example instead
  if (results.length === 0) {
    return GENERIC_EXAMPLES;
  }

  return results;
}

// Memoizes createExampleSearch on first argument, "rows", to prevent re-calculation
export const memoizedCreateExampleSearches = _.memoize(createExampleSearches);

// Get a random search pair, e.g. key:value
export const getRandomExampleSearch = ({ rows, ...options }) => _.sample(memoizedCreateExampleSearches(rows, options));
